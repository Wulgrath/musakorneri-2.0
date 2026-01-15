import { randomUUID } from "crypto";
import { Context } from "koa";
import { dynamodbGetAlbumById } from "../../services/dynamodb/albums/dynamodb-get-album-by-id.service";
import { dynamodbPutNewAlbumReview } from "../../services/dynamodb/reviews/dynamodb-put-new-album-review.service";
import { dynamodbQueryAlbumReviewByUserIdAndAlbumId } from "../../services/dynamodb/reviews/dynamodb-query-album-review-by-user-id-and-album-id.service";
import { dynamodbUpdateAlbumReviewScore } from "../../services/dynamodb/reviews/dynamodb-update-album-review-score.service";
import { Album, AlbumReview } from "../../types";

export const updateAlbumReview = async (ctx: Context): Promise<void> => {
  const { userId } = ctx.state;

  const { albumId } = ctx.params;

  const { score } = ctx.request.body;

  const existingUserReviewOfAlbum =
    await dynamodbQueryAlbumReviewByUserIdAndAlbumId(userId, albumId);

  let reviewItemToReturn;

  if (existingUserReviewOfAlbum) {
    const updatedAlbumReview = await dynamodbUpdateAlbumReviewScore(
      existingUserReviewOfAlbum.id,
      score
    );

    reviewItemToReturn = updatedAlbumReview;
  } else {
    const album: Album = await dynamodbGetAlbumById(albumId);

    if (!album) {
      ctx.throw(404, "Album to review not found");
    }

    const now = new Date().toISOString();

    const newReview: AlbumReview = {
      id: randomUUID(),
      userId,
      artistId: album.artistId,
      albumId,
      score,
      createdAt: now,
      createdAtYearMonth: now.slice(0, 7),
    };

    await dynamodbPutNewAlbumReview(newReview);

    reviewItemToReturn = newReview;
  }

  ctx.body = { albumReview: reviewItemToReturn };
};
