import { BatchGetCommand } from "@aws-sdk/lib-dynamodb";
import { MUSAKORNERI_USERS_TABLE } from "../../../constants";
import { docClient } from "../../../instances/aws";

export const dynamodbBatchGetUsersByIds = async (userIds: string[]) => {
  const batches = [];

  for (let i = 0; i < userIds.length; i += 100) {
    const batch = userIds.slice(i, i + 100);
    const command = new BatchGetCommand({
      RequestItems: {
        [MUSAKORNERI_USERS_TABLE]: {
          Keys: batch.map((id) => ({ id })),
        },
      },
    });

    batches.push(docClient.send(command));
  }

  const responses = await Promise.all(batches);
  const results = [];

  for (const response of responses) {
    if (response.Responses?.[MUSAKORNERI_USERS_TABLE]) {
      results.push(...response.Responses[MUSAKORNERI_USERS_TABLE]);
    }
  }

  return results;
};
