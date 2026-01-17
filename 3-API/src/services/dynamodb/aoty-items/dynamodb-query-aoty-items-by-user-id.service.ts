import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { MUSAKORNERI_AOTY_TABLE } from "../../../constants";
import { docClient } from "../../../instances/aws";
import { AotyItem } from "../../../types";

export const dynamodbQueryAotyItemsByUserId = async (userId: string) => {
  const result = await docClient.send(
    new QueryCommand({
      TableName: MUSAKORNERI_AOTY_TABLE,
      KeyConditionExpression: "#userId = :userId",
      ExpressionAttributeNames: {
        "#userId": "userId",
      },
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    }),
  );

  return (result.Items as AotyItem[]) || [];
};
