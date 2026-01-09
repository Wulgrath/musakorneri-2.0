import { DynamoDBStreamEvent, DynamoDBRecord, Context } from "aws-lambda";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { round } from "lodash";
import { dynamodbUpdateReviewScoreOfAlbum } from "../services/dynamodb/reviews/dynamodb-update-review-score-of-album.service";
import { dynamodbQueryReviewsByAlbumId } from "../services/dynamodb/reviews/dynamodb-query-reviews-by-album-id.service";

export const handler = async (
  event: DynamoDBStreamEvent,
  context: Context
): Promise<void> => {
  try {
    console.log(
      "DynamoDB Stream event received:",
      JSON.stringify(event, null, 2)
    );

    for (const record of event.Records) {
      await processRecord(record);
    }

    console.log("Successfully processed all records");
  } catch (error) {
    console.error("Lambda error:", error);
    throw error; // Re-throw to trigger retry
  }
};

const processRecord = async (record: DynamoDBRecord): Promise<void> => {
  const { eventName, dynamodb } = record;

  console.log(`Processing ${eventName} event`);

  switch (eventName) {
    case "INSERT":
      if (dynamodb?.NewImage) {
        // Handle new album review creation
        const newReview = unmarshall(dynamodb.NewImage as any);
        console.log("New album review created:", newReview);

        await updateReviewScoreOfAlbum(newReview.albumId);
      }
      break;

    case "MODIFY":
      if (dynamodb?.NewImage && dynamodb?.OldImage) {
        // Handle album review updates
        const newReview = unmarshall(dynamodb.NewImage as any);
        const oldReview = unmarshall(dynamodb.OldImage as any);
        console.log("Album review modified");

        await updateReviewScoreOfAlbum(newReview.albumId);
      }
      break;

    case "REMOVE":
      if (dynamodb?.OldImage) {
        // Handle album review deletion
        const oldReview = unmarshall(dynamodb.OldImage as any);
        console.log("Album review removed");

        await updateReviewScoreOfAlbum(oldReview.albumId);
      }
      break;

    default:
      console.log(`Unhandled event type: ${eventName}`);
  }
};

const updateReviewScoreOfAlbum = async (albumId: string) => {
  const reviewScore = await gatherReviewScoreOfAlbum(albumId);

  await dynamodbUpdateReviewScoreOfAlbum(albumId, reviewScore);
};

const gatherReviewScoreOfAlbum = async (albumId: string) => {
  const albumReviews = await dynamodbQueryReviewsByAlbumId(albumId);

  if (albumReviews.length > 0) {
    const totalScore = albumReviews.reduce(
      (acc, review) => acc + Number(review.score),
      0
    );
    return round(totalScore / albumReviews.length, 2);
  }

  return 0;
};
