import { Context } from "koa";
import { dynamodbGetUserById } from "../../services/dynamodb/user/dynamodb-get-user-by-id.service";
import { dynamodbQueryAlbumReviewsByUserId } from "../../services/dynamodb/reviews/dynamodb-query-album-reviews-by-user-id.service";
import { dynamodbBatchGetAlbumsByIds } from "../../services/dynamodb/albums/dynamodb-batch-get-albums-by-ids.service";
import { dynamodbQueryAotyItemsByUserId } from "../../services/dynamodb/aoty-items/dynamodb-query-aoty-items-by-user-id.service";

export const getUserPageData = async (ctx: Context): Promise<void> => {
  const { userId } = ctx.params;

  const user = await dynamodbGetUserById(userId);

  if (!user) {
    ctx.throw(404, "USER NOT FOUND");
  }

  const reviewsByUser = await dynamodbQueryAlbumReviewsByUserId(userId);

  const reviewedAlbumIds = reviewsByUser.map((review) => review.albumId);

  const [albums, aotyItems] = await Promise.all([
    dynamodbBatchGetAlbumsByIds(reviewedAlbumIds),
    dynamodbQueryAotyItemsByUserId(userId),
  ]);

  ctx.body = {
    user: { id: user.id, username: user.username, createdAt: user.createdAt },
    albumReviews: reviewsByUser,
    albums,
    aotyItems,
  };
};
