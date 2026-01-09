import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import {
  MUSAKORNERI_ALBUMS_TABLE,
  MUSAKORNERI_ALBUMS_TABLE_YEAR_REVIEW_SCORE_INDEX,
} from "../../../constants";
import { docClient } from "../../../instances/aws";
import { Album } from "../../../types";

export const dynamodbQueryAlbumsByYear = async (year: string) => {
  const result = await docClient.send(
    new QueryCommand({
      TableName: MUSAKORNERI_ALBUMS_TABLE,
      IndexName: MUSAKORNERI_ALBUMS_TABLE_YEAR_REVIEW_SCORE_INDEX,
      KeyConditionExpression: "#year = :year",
      ExpressionAttributeNames: {
        "#year": "year",
      },
      ExpressionAttributeValues: {
        ":year": year,
      },
    })
  );

  return (result.Items as Album[]) || [];
};
