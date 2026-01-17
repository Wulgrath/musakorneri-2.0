import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { MUSAKORNERI_USERS_TABLE } from "../../../constants";
import { docClient } from "../../../instances/aws";
import { User } from "../../../types";

export const dynamodbGetUserById = async (userId: string) =>
  await docClient
    .send(
      new GetCommand({
        TableName: MUSAKORNERI_USERS_TABLE,
        Key: { id: userId },
      }),
    )
    .then((res) => res.Item as User);
