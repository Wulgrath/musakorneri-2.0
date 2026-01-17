import { PutObjectCommand } from "@aws-sdk/client-s3";
import { Context, SQSEvent } from "aws-lambda";
import { s3Client } from "../instances/aws";
import { dynamodbUpdateAlbumMusicBrainzReleaseId } from "../services/dynamodb/albums/dynamodb-update-album-music-brainz-release-id.service";
import { dynamodbUpdateAlbumReleaseDateInformation } from "../services/dynamodb/albums/dynamodb-update-album-release-date-information.service";

const FILES_BUCKET_NAME = process.env.FILES_BUCKET_NAME;

export const handler = async (
  event: SQSEvent,
  context: Context,
): Promise<void> => {
  try {
    for (const record of event.Records) {
      const payload = JSON.parse(record.body);

      console.log("Processing MusicBrainz lookup for:", payload.albumName);

      const albumData = await fetchAlbumDataFromMusicBrainz(
        payload.albumName,
        payload.artistName,
      );

      if (albumData) {
        console.log("Successfully fetched album data:", albumData.title);

        // Update album with MusicBrainz release ID
        await dynamodbUpdateAlbumMusicBrainzReleaseId(
          payload.albumId,
          albumData.id,
        );

        // Update year and release date from earliest release date
        if (albumData.allReleases?.length > 0) {
          const earliestRelease = albumData.allReleases
            .filter((r: any) => r.date)
            .sort((a: any, b: any) => a.date.localeCompare(b.date))[0];

          if (earliestRelease?.date) {
            const year = earliestRelease.date.split("-")[0];
            await dynamodbUpdateAlbumReleaseDateInformation(
              payload.albumId,
              earliestRelease.date,
              year,
            );
          }
        }

        // Fetch and store cover art
        const coverArtUrl = await fetchAndStoreCoverArt(
          albumData.id,
          payload.albumId,
        );
        if (coverArtUrl) {
          console.log("Stored cover art at:", coverArtUrl);
        }
      }

      // Add 1.5-2 second delay for rate limiting (with jitter)
      const delay = 1500 + Math.random() * 500;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  } catch (error) {
    console.error("Error processing MusicBrainz queue:", error);
    throw error;
  }
};

const fetchAlbumDataFromMusicBrainz = async (
  albumName: string,
  artistName: string,
  retries = 5,
) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const query = `release:"${albumName}"${
        artistName ? ` AND artist:"${artistName}"` : ""
      }`;
      const url = `https://musicbrainz.org/ws/2/release/?query=${encodeURIComponent(
        query,
      )}&fmt=json&limit=20`;

      const response = await fetch(url, {
        headers: {
          "User-Agent": "Musakorneri.in/0.1 (wulgrath@gmail.com)",
        },
        signal: AbortSignal.timeout(30000),
      });

      if (!response.ok) {
        throw new Error(`MusicBrainz API error: ${response.status}`);
      }

      const data: any = await response.json();

      if (data.releases && data.releases.length > 0) {
        // Prioritize by release type: Album > EP > others
        const prioritizedReleases = data.releases.sort((a: any, b: any) => {
          const getTypePriority = (release: any) => {
            const type = release["release-group"]?.["primary-type"];
            if (type === "Album") return 1;
            if (type === "EP") return 2;
            return 3;
          };
          return getTypePriority(a) - getTypePriority(b);
        });

        // Check first 3 prioritized releases for cover art
        const releasesToCheck = prioritizedReleases.slice(0, 3);
        const coverArtChecks = releasesToCheck.map(async (release: any) => ({
          release,
          hasCoverArt: await checkCoverArtExists(release.id),
        }));

        const results = await Promise.all(coverArtChecks);
        const releaseWithCoverArt = results.find((r) => r.hasCoverArt);

        if (releaseWithCoverArt) {
          console.log("Found release with cover art:", {
            id: releaseWithCoverArt.release.id,
            title: releaseWithCoverArt.release.title,
            date: releaseWithCoverArt.release.date,
            type: releaseWithCoverArt.release["release-group"]?.[
              "primary-type"
            ],
          });

          return {
            ...releaseWithCoverArt.release,
            allReleases: data.releases,
          };
        }

        // If no release has cover art, return the first prioritized one
        const release = prioritizedReleases[0];
        const earliestRelease = data.releases
          .filter((r: any) => r.date)
          .sort((a: any, b: any) => a.date.localeCompare(b.date))[0];

        console.log("No cover art found, using first prioritized release:", {
          id: release.id,
          title: release.title,
          date: release.date,
          type: release["release-group"]?.["primary-type"],
        });

        return {
          ...release,
          allReleases: data.releases,
        };
      }

      console.log("No album found for:", albumName, artistName);
      return null;
    } catch (error) {
      console.error(`MusicBrainz fetch attempt ${attempt} failed:`, error);

      if (attempt === retries) {
        console.error("Max retries exceeded for MusicBrainz fetch");
        return null;
      }

      // Exponential backoff with jitter: 2-3s, 4-6s, 8-12s, 16-24s, 32-48s
      const baseDelay = Math.pow(2, attempt) * 1000;
      const jitter = Math.random() * baseDelay;
      const delay = baseDelay + jitter;
      console.log(`Retrying MusicBrainz in ${Math.round(delay)}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  return null;
};

const checkCoverArtExists = async (releaseId: string): Promise<boolean> => {
  try {
    const response = await fetch(
      `https://coverartarchive.org/release/${releaseId}`,
      {
        method: "HEAD",
        headers: {
          "User-Agent": "Musakorneri.in/0.1 (wulgrath@gmail.com)",
        },
      },
    );
    return response.ok;
  } catch (error) {
    return false;
  }
};

const fetchAndStoreCoverArt = async (releaseId: string, albumId: string) => {
  try {
    // First get the cover art metadata to find thumbnail URLs
    const metadataUrl = `https://coverartarchive.org/release/${releaseId}`;

    const metadataResponse = await fetch(metadataUrl, {
      headers: {
        "User-Agent": "Musakorneri.in/0.1 (wulgrath@gmail.com)",
      },
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    if (!metadataResponse.ok) {
      if (metadataResponse.status === 404) {
        console.log("No cover art found for release:", releaseId);
        return null;
      }
      throw new Error(`Cover Art Archive error: ${metadataResponse.status}`);
    }

    const metadata: any = await metadataResponse.json();
    const frontCover = metadata.images?.find(
      (img: any) => img.front === true || img.types?.includes("Front"),
    );

    if (!frontCover) {
      console.log("No front cover found for release:", releaseId);
      return null;
    }

    // Store full size image with retry logic
    const fullImageBuffer = await fetchWithRetry(frontCover.image);
    const contentType = "image/jpeg";
    const fullKey = `album-covers/${albumId}.jpg`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: FILES_BUCKET_NAME,
        Key: fullKey,
        Body: new Uint8Array(fullImageBuffer),
        ContentType: contentType,
      }),
    );

    // Store thumbnail (250px)
    if (frontCover.thumbnails?.small) {
      const thumbBuffer = await fetchWithRetry(frontCover.thumbnails.small);
      const thumbKey = `album-covers/thumbs/${albumId}.jpg`;

      await s3Client.send(
        new PutObjectCommand({
          Bucket: FILES_BUCKET_NAME,
          Key: thumbKey,
          Body: new Uint8Array(thumbBuffer),
          ContentType: contentType,
        }),
      );
    }

    return `https://${FILES_BUCKET_NAME}.s3.amazonaws.com/${fullKey}`;
  } catch (error) {
    console.error("Error fetching/storing cover art:", error);
    return null;
  }
};

const fetchWithRetry = async (
  url: string,
  maxRetries = 3,
): Promise<ArrayBuffer> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Musakorneri.in/0.1 (wulgrath@gmail.com)",
        },
        signal: AbortSignal.timeout(30000), // 30 second timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.arrayBuffer();
    } catch (error) {
      console.log(`Fetch attempt ${attempt} failed:`, error);

      if (attempt === maxRetries) {
        throw error;
      }

      // Exponential backoff: 2s, 4s, 8s
      const delay = Math.pow(2, attempt) * 1000;
      console.log(`Retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error("Max retries exceeded");
};
