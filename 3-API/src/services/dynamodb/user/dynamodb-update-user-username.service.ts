import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { MUSAKORNERI_USERS_TABLE } from "../../../constants";
import { docClient } from "../../../instances/aws";

export const dynamodbUpdateUserUsername = async (userId: string, username: string) =>
  await docClient
    .send(
      new UpdateCommand({
        TableName: MUSAKORNERI_USERS_TABLE,
        Key: { id: userId },
        UpdateExpression: "SET username = :username",
        ExpressionAttributeValues: {
          ":username": username,
        },
        ReturnValues: "ALL_NEW",
      })
    )
    .then((res) => res.Attributes);