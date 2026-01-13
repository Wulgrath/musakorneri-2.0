import { PutObjectCommand } from "@aws-sdk/client-s3";
import { Context, SQSEvent } from "aws-lambda";
import { s3Client } from "../instances/aws";
import { dynamodbUpdateAlbumMusicBrainzReleaseId } from "../services/dynamodb/albums/dynamodb-update-album-music-brainz-release-id.service";

const FILES_BUCKET_NAME = process.env.FILES_BUCKET_NAME;

export const handler = async (
  event: SQSEvent,
  context: Context
): Promise<void> => {
  try {
    for (const record of event.Records) {
      const payload = JSON.parse(record.body);

      console.log("Processing MusicBrainz lookup for:", payload.albumName);

      const albumData = await fetchAlbumDataFromMusicBrainz(
        payload.albumName,
        payload.artistName
      );

      if (albumData) {
        console.log("Successfully fetched album data:", albumData.title);

        // Update album with MusicBrainz release ID
        await dynamodbUpdateAlbumMusicBrainzReleaseId(
          payload.albumId,
          albumData.id
        );

        // Fetch and store cover art
        const coverArtUrl = await fetchAndStoreCoverArt(
          albumData.id,
          payload.albumId
        );
        if (coverArtUrl) {
          console.log("Stored cover art at:", coverArtUrl);
        }
      }

      // Add 1-second delay for rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  } catch (error) {
    console.error("Error processing MusicBrainz queue:", error);
    throw error;
  }
};

const fetchAlbumDataFromMusicBrainz = async (
  albumName: string,
  artistName: string
) => {
  try {
    const query = `release:"${albumName}"${
      artistName ? ` AND artist:"${artistName}"` : ""
    }`;
    const url = `https://musicbrainz.org/ws/2/release/?query=${encodeURIComponent(
      query
    )}&fmt=json&limit=10`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Musakorneri.in/0.1 (wulgrath@gmail.com)",
      },
    });

    if (!response.ok) {
      throw new Error(`MusicBrainz API error: ${response.status}`);
    }

    const data: any = await response.json();

    if (data.releases && data.releases.length > 0) {
      // Check first 3 releases in parallel for cover art
      const releasesToCheck = data.releases.slice(0, 3);
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
          country: releaseWithCoverArt.release.country,
        });
        return releaseWithCoverArt.release;
      }

      // If no release has cover art, return the first one
      const release = data.releases[0];
      console.log("No cover art found, using first release:", {
        id: release.id,
        title: release.title,
        date: release.date,
        country: release.country,
      });
      return release;
    }

    console.log("No album found for:", albumName, artistName);
    return null;
  } catch (error) {
    console.error("Error fetching from MusicBrainz:", error);
    return null;
  }
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
      }
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
      (img: any) => img.front === true || img.types?.includes("Front")
    );

    if (!frontCover) {
      console.log("No front cover found for release:", releaseId);
      return null;
    }

    // Store full size image
    const fullImageBuffer = await fetch(frontCover.image).then((r) =>
      r.arrayBuffer()
    );
    const contentType = "image/jpeg";
    const fullKey = `album-covers/${albumId}.jpg`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: FILES_BUCKET_NAME,
        Key: fullKey,
        Body: new Uint8Array(fullImageBuffer),
        ContentType: contentType,
      })
    );

    // Store thumbnail (250px)
    if (frontCover.thumbnails?.small) {
      const thumbBuffer = await fetch(frontCover.thumbnails.small).then((r) =>
        r.arrayBuffer()
      );
      const thumbKey = `album-covers/thumbs/${albumId}.jpg`;

      await s3Client.send(
        new PutObjectCommand({
          Bucket: FILES_BUCKET_NAME,
          Key: thumbKey,
          Body: new Uint8Array(thumbBuffer),
          ContentType: contentType,
        })
      );
    }

    return `https://${FILES_BUCKET_NAME}.s3.amazonaws.com/${fullKey}`;
  } catch (error) {
    console.error("Error fetching/storing cover art:", error);
    return null;
  }
};
