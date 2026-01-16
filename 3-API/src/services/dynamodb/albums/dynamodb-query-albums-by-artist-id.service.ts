import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import {
  MUSAKORNERI_ALBUMS_TABLE,
  MUSAKORNERI_ALBUMS_TABLE_ARTIST_ID_INDEX,
} from "../../../constants";
import { docClient } from "../../../instances/aws";
import { Album } from "../../../types";

export const dynamodbQueryAlbumsByArtistId = async (artistId: string) => {
  const result = await docClient.send(
    new QueryCommand({
      TableName: MUSAKORNERI_ALBUMS_TABLE,
      IndexName: MUSAKORNERI_ALBUMS_TABLE_ARTIST_ID_INDEX,
      KeyConditionExpression: "#artistId = :artistId",
      ExpressionAttributeNames: {
        "#artistId": "artistId",
      },
      ExpressionAttributeValues: {
        ":artistId": artistId,
      },
    }),
  );

  return (result.Items as Album[]) || [];
};
