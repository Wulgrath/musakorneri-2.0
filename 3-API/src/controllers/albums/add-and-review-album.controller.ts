import { Context } from "koa";
import { dynamodbPutNewAlbum } from "../../services/dynamodb/albums/dynamodb-put-new-album.service";
import { dynamodbScanAlbums } from "../../services/dynamodb/albums/dynamodb-scan-albums.service";
import { dynamodbPutNewArtist } from "../../services/dynamodb/artists/dynamodb-put-new-artist.service";
import { dynamodbScanArtists } from "../../services/dynamodb/artists/dynamodb-scan-artists.service";
import { dynamodbPutNewAlbumReview } from "../../services/dynamodb/reviews/dynamodb-put-new-album-review.service";
import { Album } from "../../types";

export const addAndReviewAlbum = async (ctx: Context): Promise<void> => {
  const userId = ctx.state.userId;

  const { artist, albumName, year, score } = ctx.request.body;

  const [existingArtists, existingAlbums] = await Promise.all([
    dynamodbScanArtists(),
    dynamodbScanAlbums(),
  ]);

  const alreadyExistingArtist = existingArtists?.find(
    (existingArtist: any) => existingArtist.name.toLowerCase() === artist.toLowerCase()
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
      year,
      createdAt: now,
    };

    await dynamodbPutNewAlbum(newAlbum);

    const newAlbumReview = {
      id: crypto.randomUUID(),
      albumId: newAlbum.id,
      userId,
      score,
      createdAt: now,
      artistId: newArtist.id,
    };

    await dynamodbPutNewAlbumReview(newAlbumReview);
  } else {
    const isAlreadyExistingAlbum = existingAlbums?.find(
      (album: any) =>
        album.name.toLowerCase() === albumName.toLowerCase() &&
        album.artistId === alreadyExistingArtist.id
    );

    if (!isAlreadyExistingAlbum) {
      const newAlbum: Album = {
        id: crypto.randomUUID(),
        artistId: alreadyExistingArtist.id,
        name: albumName,
        year,
        createdAt: now,
      };

      await dynamodbPutNewAlbum(newAlbum);

      const newAlbumReview = {
        id: crypto.randomUUID(),
        albumId: newAlbum.id,
        userId,
        score,
        createdAt: now,
        artistId: alreadyExistingArtist.id,
      };

      await dynamodbPutNewAlbumReview(newAlbumReview);
    } else {
      const newAlbumReview = {
        id: crypto.randomUUID(),
        albumId: isAlreadyExistingAlbum.id,
        userId,
        score,
        createdAt: now,
        artistId: alreadyExistingArtist.id,
      };

      await dynamodbPutNewAlbumReview(newAlbumReview);
    }
  }

  ctx.body = {};
};
