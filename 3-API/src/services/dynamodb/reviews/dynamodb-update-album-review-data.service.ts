import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { MUSAKORNERI_ALBUM_REVIEWS_TABLE } from "../../../constants";
import { docClient } from "../../../instances/aws";

export const dynamodbUpdateAlbumReviewData = async (
  reviewId: string,
  score: number,
  reviewText: string,
) =>
  await docClient
    .send(
      new UpdateCommand({
        TableName: MUSAKORNERI_ALBUM_REVIEWS_TABLE,
        Key: { id: reviewId },
        UpdateExpression: "SET score = :score, reviewText = :reviewText",
        ExpressionAttributeValues: {
          ":score": score,
          ":reviewText": reviewText,
        },
        ReturnValues: "ALL_NEW",
      }),
    )
    .then((res) => res.Attributes);
