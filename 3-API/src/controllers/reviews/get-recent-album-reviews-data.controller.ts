import { Context } from "koa";
import { dynamodbBatchGetAlbumsByIds } from "../../services/dynamodb/albums/dynamodb-batch-get-albums-by-ids.service";
import { dynamodbBatchGetArtistsByIds } from "../../services/dynamodb/artists/dynamodb-batch-get-artists-by-ids.service";
import { dynamodbQueryAlbumReviewsByCreatedAt } from "../../services/dynamodb/reviews/dynamodb-query-album-reviews-by-created-at.service";
import { AlbumReview } from "../../types";
import { uniq } from "lodash";
import dayjs from "dayjs";

export const getRecentAlbumReviewsData = async (
  ctx: Context
): Promise<void> => {
  const monthAgo = dayjs().subtract(1, "month").toISOString();

  const albumReviewsDuringLastMonth: AlbumReview[] =
    (await dynamodbQueryAlbumReviewsByCreatedAt(monthAgo)) || [];

  const albumIdsOfReviews = uniq(
    albumReviewsDuringLastMonth?.map((albumReview) => albumReview.albumId)
  );

  const artistIdsOfReviews = uniq(
    albumReviewsDuringLastMonth?.map((albumReview) => albumReview.artistId)
  );

  const [albums, artists] = await Promise.all([
    albumIdsOfReviews.length > 0
      ? dynamodbBatchGetAlbumsByIds(albumIdsOfReviews)
      : [],
    artistIdsOfReviews.length > 0
      ? dynamodbBatchGetArtistsByIds(artistIdsOfReviews)
      : [],
  ]);

  ctx.body = {
    albumReviews: albumReviewsDuringLastMonth,
    albums: albums || [],
    artists: artists || [],
  };
};
