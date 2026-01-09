import { BatchGetCommand } from "@aws-sdk/lib-dynamodb";
import { MUSAKORNERI_ARTISTS_TABLE } from "../../../constants";
import { docClient } from "../../../instances/aws";

export const dynamodbBatchGetArtistsByIds = async (artistIds: string[]) => {
  const batches = [];

  for (let i = 0; i < artistIds.length; i += 100) {
    const batch = artistIds.slice(i, i + 100);
    const command = new BatchGetCommand({
      RequestItems: {
        [MUSAKORNERI_ARTISTS_TABLE]: {
          Keys: batch.map((id) => ({ id })),
        },
      },
    });

    batches.push(docClient.send(command));
  }

  const responses = await Promise.all(batches);
  const results = [];

  for (const response of responses) {
    if (response.Responses?.[MUSAKORNERI_ARTISTS_TABLE]) {
      results.push(...response.Responses[MUSAKORNERI_ARTISTS_TABLE]);
    }
  }

  return results;
};
