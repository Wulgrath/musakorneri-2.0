import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { MUSAKORNERI_ARTISTS_TABLE } from "../../../constants";
import { docClient } from "../../../instances/aws";

export const dynamodbScanArtists = async () =>
  await docClient
    .send(
      new ScanCommand({
        TableName: MUSAKORNERI_ARTISTS_TABLE,
      })
    )
    .then((res) => res.Items);
