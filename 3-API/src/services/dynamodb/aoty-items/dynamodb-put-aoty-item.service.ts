import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { MUSAKORNERI_AOTY_TABLE } from "../../../constants";
import { docClient } from "../../../instances/aws";
import { AotyItem } from "../../../types";

export const dynamodbPutAotyItem = async (aotyItem: AotyItem) =>
  await docClient.send(
    new PutCommand({
      TableName: MUSAKORNERI_AOTY_TABLE,
      Item: aotyItem,
    }),
  );
