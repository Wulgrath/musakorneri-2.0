import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { MUSAKORNERI_ALBUMS_TABLE } from "../../../constants";
import { docClient } from "../../../instances/aws";
import { Album } from "../../../types";

export const dynamodbPutNewAlbum = async (albumItem: Album) =>
  await docClient.send(
    new PutCommand({
      TableName: MUSAKORNERI_ALBUMS_TABLE,
      Item: albumItem,
    })
  );
