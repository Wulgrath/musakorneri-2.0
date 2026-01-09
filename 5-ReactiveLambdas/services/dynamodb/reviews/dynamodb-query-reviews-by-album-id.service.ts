import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import {
  MUSAKORNERI_ALBUM_REVIEWS_TABLE,
  MUSAKORNERI_ALBUM_REVIEWS_TABLE_ALBUM_ID_INDEX,
} from "../../../constants";
import { docClient } from "../../../instances/aws";

export const dynamodbQueryReviewsByAlbumId = async (albumId: string) =>
  await docClient
    .send(
      new QueryCommand({
        TableName: MUSAKORNERI_ALBUM_REVIEWS_TABLE,
        IndexName: MUSAKORNERI_ALBUM_REVIEWS_TABLE_ALBUM_ID_INDEX,
        KeyConditionExpression: "albumId = :albumId",
        ExpressionAttributeValues: {
          ":albumId": albumId,
        },
      })
    )
    .then((res) => res.Items || []);
