import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../../../instances/aws";
import { MUSAKORNERI_ALBUMS_TABLE } from "../../../constants";

export const dynamodbUpdateAlbumInformationfromMusicbrainzData = async (
  albumId: string,
  releaseDate: string,
  year: string,
  albumName?: string,
): Promise<void> => {
  const updateExpression = albumName
    ? "SET #releaseDate = :releaseDate, #year = :year, #name = :name"
    : "SET #releaseDate = :releaseDate, #year = :year";

  const expressionAttributeNames: Record<string, string> = {
    "#releaseDate": "releaseDate",
    "#year": "year",
  };

  const expressionAttributeValues: Record<string, string> = {
    ":releaseDate": releaseDate,
    ":year": year,
  };

  if (albumName) {
    expressionAttributeNames["#name"] = "name";
    expressionAttributeValues[":name"] = albumName;
  }

  await docClient.send(
    new UpdateCommand({
      TableName: MUSAKORNERI_ALBUMS_TABLE,
      Key: { id: albumId },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    }),
  );
};
