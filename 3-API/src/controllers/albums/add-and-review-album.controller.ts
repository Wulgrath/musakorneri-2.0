import { Context } from "koa";
import { dynamodbPutNewAlbum } from "../../services/dynamodb/albums/dynamodb-put-new-album.service";
import { dynamodbScanAlbums } from "../../services/dynamodb/albums/dynamodb-scan-albums.service";
import { dynamodbPutNewArtist } from "../../services/dynamodb/artists/dynamodb-put-new-artist.service";
import { dynamodbScanArtists } from "../../services/dynamodb/artists/dynamodb-scan-artists.service";
import { dynamodbPutNewAlbumReview } from "../../services/dynamodb/reviews/dynamodb-put-new-album-review.service";
import { dynamodbQueryAlbumReviewByUserIdAndAlbumId } from "../../services/dynamodb/reviews/dynamodb-query-album-review-by-user-id-and-album-id.service";
import { dynamodbUpdateAlbumReviewData } from "../../services/dynamodb/reviews/dynamodb-update-album-review-data.service";
import { Album, AlbumReview } from "../../types";

export const addAndReviewAlbum = async (ctx: Context): Promise<void> => {
  const userId = ctx.state.userId;

  const { artist, albumName, score, reviewText } = ctx.request.body;

  if (!artist || !albumName || score === undefined) {
    ctx.status = 400;
    ctx.body = {
      error: "Missing required fields: artist, albumName, score",
    };
    return;
  }

  const [existingArtists, existingAlbums] = await Promise.all([
    dynamodbScanArtists(),
    dynamodbScanAlbums(),
  ]);

  const alreadyExistingArtist = existingArtists?.find(
    (existingArtist: any) =>
      existingArtist.name.toLowerCase() === artist.toLowerCase(),
  );

  const now = new Date().toISOString();

  if (!alreadyExistingArtist) {
    const newArtist = {
      id: crypto.randomUUID(),
      name: artist,
      createdAt: now,
      createdBy: userId,
    };

    await dynamodbPutNewArtist(newArtist);

    const newAlbum: Album = {
      id: crypto.randomUUID(),
      artistId: newArtist.id,
      name: albumName,
      createdAt: now,
    };

    await dynamodbPutNewAlbum(newAlbum);

    const newAlbumReview: AlbumReview = {
      id: crypto.randomUUID(),
      albumId: newAlbum.id,
      userId,
      score,
      createdAt: now,
      createdAtYearMonth: now.slice(0, 7),
      artistId: newArtist.id,
      reviewText,
    };

    await dynamodbPutNewAlbumReview(newAlbumReview);
  } else {
    const alreadyExistingAlbum = existingAlbums?.find(
      (album: any) =>
        album.name.toLowerCase() === albumName.toLowerCase() &&
        album.artistId === alreadyExistingArtist.id,
    );

    if (!alreadyExistingAlbum) {
      const newAlbum: Album = {
        id: crypto.randomUUID(),
        artistId: alreadyExistingArtist.id,
        name: albumName,
        createdAt: now,
      };

      await dynamodbPutNewAlbum(newAlbum);

      const newAlbumReview: AlbumReview = {
        id: crypto.randomUUID(),
        albumId: newAlbum.id,
        userId,
        score,
        createdAt: now,
        createdAtYearMonth: now.slice(0, 7),
        artistId: alreadyExistingArtist.id,
        reviewText,
      };

      await dynamodbPutNewAlbumReview(newAlbumReview);
    } else {
      const existingReviewForAlbum =
        await dynamodbQueryAlbumReviewByUserIdAndAlbumId(
          userId,
          alreadyExistingAlbum.id,
        );

      if (!existingReviewForAlbum) {
        const newAlbumReview: AlbumReview = {
          id: crypto.randomUUID(),
          albumId: alreadyExistingAlbum.id,
          userId,
          score,
          createdAt: now,
          createdAtYearMonth: now.slice(0, 7),
          artistId: alreadyExistingArtist.id,
          reviewText,
        };

        await dynamodbPutNewAlbumReview(newAlbumReview);
      } else {
        await dynamodbUpdateAlbumReviewData(
          existingReviewForAlbum.id,
          score,
          reviewText,
        );
      }
    }
  }

  ctx.body = {};
};
