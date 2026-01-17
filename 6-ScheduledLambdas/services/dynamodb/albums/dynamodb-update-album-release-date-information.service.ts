import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../../../instances/aws";
import { MUSAKORNERI_ALBUMS_TABLE } from "../../../constants";

export const dynamodbUpdateAlbumReleaseDateInformation = async (
  albumId: string,
  releaseDate: string,
  year: string,
): Promise<void> => {
  await docClient.send(
    new UpdateCommand({
      TableName: MUSAKORNERI_ALBUMS_TABLE,
      Key: { id: albumId },
      UpdateExpression: "SET #releaseDate = :releaseDate, #year = :year",
      ExpressionAttributeNames: {
        "#releaseDate": "releaseDate",
        "#year": "year",
      },
      ExpressionAttributeValues: {
        ":releaseDate": releaseDate,
        ":year": year,
      },
    }),
  );
};
