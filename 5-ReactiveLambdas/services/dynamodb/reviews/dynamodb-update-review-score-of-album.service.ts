import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../../../instances/aws";
import { MUSAKORNERI_ALBUMS_TABLE } from "../../../constants";

export const dynamodbUpdateReviewScoreOfAlbum = async (
  albumId: string,
  reviewScore: number
) =>
  await docClient.send(
    new UpdateCommand({
      TableName: MUSAKORNERI_ALBUMS_TABLE,
      Key: {
        id: albumId,
      },
      UpdateExpression: "SET reviewScore = :reviewScore",
      ExpressionAttributeValues: {
        ":reviewScore": reviewScore,
      },
      ReturnValues: "UPDATED_NEW",
    })
  );
