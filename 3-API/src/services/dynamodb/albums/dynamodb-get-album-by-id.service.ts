import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { MUSAKORNERI_ALBUMS_TABLE } from "../../../constants";
import { docClient } from "../../../instances/aws";
import { Album } from "../../../types";

export const dynamodbGetAlbumById = async (albumId: string) =>
  await docClient
    .send(
      new GetCommand({
        TableName: MUSAKORNERI_ALBUMS_TABLE,
        Key: { id: albumId },
      })
    )
    .then((res) => res.Item as Album);
