import { Context } from "koa";
import { dynamodbQueryAlbumReviewsByUserId } from "../../services/dynamodb/reviews/dynamodb-query-album-reviews-by-user-id.service";

export const getMyAlbumReviews = async (ctx: Context): Promise<void> => {
  const { userId } = ctx.state;

  console.log("USER ID IN ROUTE", userId);

  const reviews = await dynamodbQueryAlbumReviewsByUserId(userId);

  console.log("REVIEWS", reviews);

  ctx.body = { albumReviews: reviews };
};
