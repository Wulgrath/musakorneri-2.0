import { DynamoDBStreamEvent, DynamoDBRecord, Context } from "aws-lambda";
import { unmarshall } from "@aws-sdk/util-dynamodb";

export const handler = async (
  event: DynamoDBStreamEvent,
  context: Context
): Promise<void> => {
  try {
    console.log(
      "DynamoDB Stream event received:",
      JSON.stringify(event, null, 2)
    );

    for (const record of event.Records) {
      await processRecord(record);
    }

    console.log("Successfully processed all records");
  } catch (error) {
    console.error("Lambda error:", error);
    throw error; // Re-throw to trigger retry
  }
};

const processRecord = async (record: DynamoDBRecord): Promise<void> => {
  const { eventName, dynamodb } = record;

  console.log(`Processing ${eventName} event`);

  switch (eventName) {
    case "INSERT":
      if (dynamodb?.NewImage) {
        // Handle new album review creation
        const newAlbum = unmarshall(dynamodb.NewImage as any);

        await fetchAlbumDataFromSpotifyApi(newAlbum.name, "");

        console.log("New album review created:", newAlbum);
      }
      break;

    case "MODIFY":
      if (dynamodb?.NewImage && dynamodb?.OldImage) {
        // Handle album review updates
        const newReview = unmarshall(dynamodb.NewImage as any);
        const oldReview = unmarshall(dynamodb.OldImage as any);
        console.log("Album review modified");
      }
      break;

    case "REMOVE":
      if (dynamodb?.OldImage) {
        // Handle album review deletion
        const oldReview = unmarshall(dynamodb.OldImage as any);
        console.log("Album review removed");
      }
      break;

    default:
      console.log(`Unhandled event type: ${eventName}`);
  }
};

const fetchAlbumDataFromSpotifyApi = async (
  albumName: string,
  artistName: string
) => {};
