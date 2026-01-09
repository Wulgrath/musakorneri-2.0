import { Context } from "koa";
import { dynamodbBatchGetAlbumsByIds } from "../../services/dynamodb/albums/dynamodb-batch-get-albums-by-ids.service";
import { dynamodbBatchGetArtistsByIds } from "../../services/dynamodb/artists/dynamodb-batch-get-artists-by-ids.service";
import { dynamodbQueryAlbumReviewsByCreatedAt } from "../../services/dynamodb/reviews/dynamodb-query-album-reviews-by-created-at.service";
import { AlbumReview } from "../../types";
import { uniq } from "lodash";
import dayjs from "dayjs";
import { dynamodbBatchGetUsersByIds } from "../../services/dynamodb/user/dynamodb-batch-get-users-by-ids.service";

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

  const userIdsOfReviews = uniq(
    albumReviewsDuringLastMonth?.map((albumReview) => albumReview.userId)
  );

  const [albums, artists, users] = await Promise.all([
    albumIdsOfReviews.length > 0
      ? dynamodbBatchGetAlbumsByIds(albumIdsOfReviews)
      : [],
    artistIdsOfReviews.length > 0
      ? dynamodbBatchGetArtistsByIds(artistIdsOfReviews)
      : [],
    userIdsOfReviews.length > 0
      ? dynamodbBatchGetUsersByIds(userIdsOfReviews)
      : [],
  ]);

  const cleanedUsers = users?.map((user) => ({
    id: user.id,
    username: user.username,
  }));

  ctx.body = {
    albumReviews: albumReviewsDuringLastMonth,
    albums: albums || [],
    artists: artists || [],
    users: cleanedUsers || [],
  };
};
