import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../../../instances/aws";
import { MUSAKORNERI_ALBUMS_TABLE } from "../../../constants";

export const dynamodbUpdateAlbumYear = async (
  albumId: string,
  year: string
): Promise<void> => {
  await docClient.send(
    new UpdateCommand({
      TableName: MUSAKORNERI_ALBUMS_TABLE,
      Key: { id: albumId },
      UpdateExpression: "SET #year = :year",
      ExpressionAttributeNames: {
        "#year": "year",
      },
      ExpressionAttributeValues: {
        ":year": year,
      },
    })
  );
};
