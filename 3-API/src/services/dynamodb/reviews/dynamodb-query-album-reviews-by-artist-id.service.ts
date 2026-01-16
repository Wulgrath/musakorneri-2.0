import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import {
  MUSAKORNERI_ALBUM_REVIEWS_TABLE,
  MUSAKORNERI_ALBUM_REVIEWS_TABLE_ARTIST_ID_INDEX,
} from "../../../constants";
import { docClient } from "../../../instances/aws";
import { AlbumReview } from "../../../types";

export const dynamodbQueryAlbumReviewsByArtistId = async (artistId: string) => {
  const result = await docClient.send(
    new QueryCommand({
      TableName: MUSAKORNERI_ALBUM_REVIEWS_TABLE,
      IndexName: MUSAKORNERI_ALBUM_REVIEWS_TABLE_ARTIST_ID_INDEX,
      KeyConditionExpression: "#artistId = :artistId",
      ExpressionAttributeNames: {
        "#artistId": "artistId",
      },
      ExpressionAttributeValues: {
        ":artistId": artistId,
      },
    }),
  );

  return (result.Items as AlbumReview[]) || [];
};
