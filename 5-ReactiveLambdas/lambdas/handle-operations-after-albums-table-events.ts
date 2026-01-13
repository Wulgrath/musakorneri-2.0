import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { Context, DynamoDBRecord, DynamoDBStreamEvent } from "aws-lambda";
import { dynamodbGetArtistById } from "../services/dynamodb/artists/dynamodb-get-artist-by-id.service";
import { sqsClient } from "../instances/aws";

const MUSICBRAINZ_QUEUE_URL = process.env.MUSICBRAINZ_QUEUE_URL;

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
    throw error;
  }
};

const processRecord = async (record: DynamoDBRecord): Promise<void> => {
  const { eventName, dynamodb } = record;

  console.log(`Processing ${eventName} event`);

  switch (eventName) {
    case "INSERT":
      if (dynamodb?.NewImage) {
        const newAlbum = unmarshall(dynamodb.NewImage as any);
        const albumArtist = await dynamodbGetArtistById(newAlbum.artistId);

        await sendToMusicBrainzQueue({
          albumName: newAlbum.name,
          artistName: albumArtist?.name || "",
          albumId: newAlbum.id,
        });

        console.log("Queued MusicBrainz lookup for:", newAlbum.name);
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

const sendToMusicBrainzQueue = async (payload: {
  albumName: string;
  artistName: string;
  albumId: string;
}) => {
  if (!MUSICBRAINZ_QUEUE_URL) {
    console.error("MUSICBRAINZ_QUEUE_URL not configured");
    return;
  }

  const command = new SendMessageCommand({
    QueueUrl: MUSICBRAINZ_QUEUE_URL,
    MessageBody: JSON.stringify(payload),
  });

  await sqsClient.send(command);
};
