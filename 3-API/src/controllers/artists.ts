import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { Context } from "koa";
import { Artist, CreateArtistRequest } from "../types";

const client = DynamoDBDocumentClient.from(new DynamoDBClient());
const TABLE_NAME = "musakorneri-artists-table";

export const getAllArtists = async (ctx: Context): Promise<void> => {
  const command = new ScanCommand({ TableName: TABLE_NAME });
  const response = await client.send(command);

  ctx.body = response.Items || [];
};

export const createArtist = async (ctx: Context): Promise<void> => {
  try {
    const artist = ctx.request.body as CreateArtistRequest;

    if (!artist.name) {
      ctx.status = 400;
      ctx.body = { error: "Name is required" };
      return;
    }

    const item: Artist = {
      id: artist.id || Date.now().toString(),
      name: artist.name,
      genre: artist.genre,
      country: artist.country,
      createdAt: new Date().toISOString(),
    };

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: item,
    });

    await client.send(command);

    ctx.status = 201;
    ctx.body = item;
  } catch (error) {
    console.error("Error creating artist:", error);
    ctx.status = 500;
    ctx.body = { error: "Failed to create artist" };
  }
};
