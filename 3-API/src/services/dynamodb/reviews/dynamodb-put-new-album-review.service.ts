import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../../../instances/aws";
import { AlbumReview } from "../../../types";
import { MUSAKORNERI_ALBUM_REVIEWS_TABLE } from "../../../constants";

export const dynamodbPutNewAlbumReview = async (albumReviewItem: AlbumReview) =>
  await docClient.send(
    new PutCommand({
      TableName: MUSAKORNERI_ALBUM_REVIEWS_TABLE,
      Item: albumReviewItem,
    })
  );
