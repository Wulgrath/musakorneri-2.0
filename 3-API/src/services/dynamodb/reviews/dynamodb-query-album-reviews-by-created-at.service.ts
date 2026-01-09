import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { MUSAKORNERI_ALBUM_REVIEWS_TABLE } from "../../../constants";
import { docClient } from "../../../instances/aws";
import { AlbumReview } from "../../../types";

export const dynamodbQueryAlbumReviewsByCreatedAt = async (
  afterDate: string
) => {
  const result = await docClient.send(
    new ScanCommand({
      TableName: MUSAKORNERI_ALBUM_REVIEWS_TABLE,
      FilterExpression: "createdAt > :afterDate",
      ExpressionAttributeValues: {
        ":afterDate": afterDate,
      },
    })
  );

  return (result.Items as AlbumReview[]) || [];
};
