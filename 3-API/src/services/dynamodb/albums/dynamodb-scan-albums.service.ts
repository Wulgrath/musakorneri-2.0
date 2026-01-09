import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { MUSAKORNERI_ALBUMS_TABLE } from "../../../constants";
import { docClient } from "../../../instances/aws";

export const dynamodbScanAlbums = async () =>
  await docClient
    .send(
      new ScanCommand({
        TableName: MUSAKORNERI_ALBUMS_TABLE,
      })
    )
    .then((res) => res.Items);
