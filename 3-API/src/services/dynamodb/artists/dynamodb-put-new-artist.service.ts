import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../../../instances/aws";
import { Artist } from "../../../types";
import { MUSAKORNERI_ARTISTS_TABLE } from "../../../constants";

export const dynamodbPutNewArtist = async (artistItem: Artist) =>
  await docClient.send(
    new PutCommand({
      TableName: MUSAKORNERI_ARTISTS_TABLE,
      Item: artistItem,
    })
  );
