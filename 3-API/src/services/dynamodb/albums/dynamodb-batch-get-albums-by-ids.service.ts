import { BatchGetCommand } from "@aws-sdk/lib-dynamodb";
import { MUSAKORNERI_ALBUMS_TABLE } from "../../../constants";
import { docClient } from "../../../instances/aws";

export const dynamodbBatchGetAlbumsByIds = async (albumIds: string[]) => {
  const batches = [];
  
  for (let i = 0; i < albumIds.length; i += 100) {
    const batch = albumIds.slice(i, i + 100);
    const command = new BatchGetCommand({
      RequestItems: {
        [MUSAKORNERI_ALBUMS_TABLE]: {
          Keys: batch.map(id => ({ id })),
        },
      },
    });
    
    batches.push(docClient.send(command));
  }
  
  const responses = await Promise.all(batches);
  const results = [];
  
  for (const response of responses) {
    if (response.Responses?.[MUSAKORNERI_ALBUMS_TABLE]) {
      results.push(...response.Responses[MUSAKORNERI_ALBUMS_TABLE]);
    }
  }
  
  return results;
};
