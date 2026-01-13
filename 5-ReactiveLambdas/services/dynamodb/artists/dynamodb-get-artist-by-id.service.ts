import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { MUSAKORNERI_ARTISTS_TABLE } from "../../../constants";
import { docClient } from "../../../instances/aws";

export const dynamodbGetArtistById = async (artistId: string) =>
  await docClient
    .send(
      new GetCommand({
        TableName: MUSAKORNERI_ARTISTS_TABLE,
        Key: { id: artistId },
      })
    )
    .then((res) => res.Item);
