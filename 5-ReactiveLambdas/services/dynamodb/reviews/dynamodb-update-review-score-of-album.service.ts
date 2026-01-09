import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../../../instances/aws";
import { MUSAKORNERI_ALBUMS_TABLE } from "../../../constants";

export const dynamodbUpdateReviewInfoOfAlbum = async (
  albumId: string,
  reviewScore: number,
  reviewCount: number
) =>
  await docClient.send(
    new UpdateCommand({
      TableName: MUSAKORNERI_ALBUMS_TABLE,
      Key: {
        id: albumId,
      },
      UpdateExpression:
        "SET reviewScore = :reviewScore, reviewCount = :reviewCount",
      ExpressionAttributeValues: {
        ":reviewScore": reviewScore,
        ":reviewCount": reviewCount,
      },
      ReturnValues: "UPDATED_NEW",
    })
  );
