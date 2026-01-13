import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../../../instances/aws";

export const dynamodbUpdateAlbumMusicBrainzReleaseId = async (
  albumId: string,
  musicbrainzReleaseId: string
): Promise<void> => {
  await docClient.send(
    new UpdateCommand({
      TableName: process.env.ALBUMS_TABLE_NAME,
      Key: { id: albumId },
      UpdateExpression: "SET musicbrainzReleaseId = :releaseId",
      ExpressionAttributeValues: {
        ":releaseId": musicbrainzReleaseId,
      },
    })
  );
};
