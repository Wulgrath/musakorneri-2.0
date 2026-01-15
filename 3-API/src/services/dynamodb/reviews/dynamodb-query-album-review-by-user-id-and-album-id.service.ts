import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import {
  MUSAKORNERI_ALBUM_REVIEWS_TABLE,
  MUSAKORNERI_ALBUM_REVIEWS_USER_ID_ALBUM_ID_INDEX,
} from "../../../constants";
import { docClient } from "../../../instances/aws";

export const dynamodbQueryAlbumReviewByUserIdAndAlbumId = async (
  userId: string,
  albumId: string
) =>
  await docClient
    .send(
      new QueryCommand({
        TableName: MUSAKORNERI_ALBUM_REVIEWS_TABLE,
        IndexName: MUSAKORNERI_ALBUM_REVIEWS_USER_ID_ALBUM_ID_INDEX,
        KeyConditionExpression: "userId = :userId AND albumId = :albumId",
        ExpressionAttributeValues: {
          ":userId": userId,
          ":albumId": albumId,
        },
      })
    )
    .then((res) => (res.Items ? res.Items[0] : undefined));
