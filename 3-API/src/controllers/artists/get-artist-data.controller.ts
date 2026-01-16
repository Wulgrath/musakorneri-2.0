import { Context } from "koa";
import { dynamodbGetArtistById } from "../../services/dynamodb/artists/dynamodb-get-artist-by-id.service";
import { dynamodbQueryAlbumReviewsByArtistId } from "../../services/dynamodb/reviews/dynamodb-query-album-reviews-by-artist-id.service";
import { dynamodbQueryAlbumsByArtistId } from "../../services/dynamodb/albums/dynamodb-query-albums-by-artist-id.service";

export const getArtistData = async (ctx: Context): Promise<void> => {
  const { artistId } = ctx.params;

  const artistItem = await dynamodbGetArtistById(artistId);

  if (!artistItem) {
    ctx.throw(404, `Artist with id ${artistId} not found`);
  }

  const [artistAlbums, artistReviews] = await Promise.all([
    dynamodbQueryAlbumsByArtistId(artistId),
    dynamodbQueryAlbumReviewsByArtistId(artistId),
  ]);

  ctx.body = {
    artist: artistItem,
    albums: artistAlbums,
    albumReviews: artistReviews,
  };
};
