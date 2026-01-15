import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { MUSAKORNERI_ALBUM_REVIEWS_TABLE } from "../../../constants";
import { docClient } from "../../../instances/aws";

export const dynamodbUpdateAlbumReviewScore = async (
  reviewId: string,
  score: number
) =>
  await docClient
    .send(
      new UpdateCommand({
        TableName: MUSAKORNERI_ALBUM_REVIEWS_TABLE,
        Key: { id: reviewId },
        UpdateExpression: "SET score = :score",
        ExpressionAttributeValues: {
          ":score": score,
        },
        ReturnValues: "ALL_NEW",
      })
    )
    .then((res) => res.Attributes);
