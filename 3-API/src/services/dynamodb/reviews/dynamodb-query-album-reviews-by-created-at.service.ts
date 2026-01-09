import { QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import {
  MUSAKORNERI_ALBUM_REVIEWS_TABLE,
  MUSAKORNERI_ALBUM_REVIEWS_TABLE_CREATED_AT_INDEX,
} from "../../../constants";
import { docClient } from "../../../instances/aws";
import { AlbumReview } from "../../../types";

export const dynamodbQueryAlbumReviewsByCreatedAt = async (
  afterDate: string
) => {
  const result = await docClient.send(
    new QueryCommand({
      TableName: MUSAKORNERI_ALBUM_REVIEWS_TABLE,
      IndexName: MUSAKORNERI_ALBUM_REVIEWS_TABLE_CREATED_AT_INDEX,
      KeyConditionExpression: "createdAt > :afterDate",
      ExpressionAttributeValues: {
        ":afterDate": afterDate,
      },
    })
  );

  return (result.Items as AlbumReview[]) || [];
};
