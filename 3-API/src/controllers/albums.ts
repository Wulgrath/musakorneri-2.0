import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";
import { Context } from "koa";
import { Album, CreateAlbumRequest } from "../types";

const client = DynamoDBDocumentClient.from(new DynamoDBClient());
const TABLE_NAME = "musakorneri-albums-table";

export const getAllAlbums = async (ctx: Context): Promise<void> => {
  try {
    const command = new ScanCommand({ TableName: TABLE_NAME });
    const response = await client.send(command);

    ctx.body = response.Items || [];
  } catch (error) {
    console.error("Error fetching albums:", error);
    ctx.status = 500;
    ctx.body = { error: "Failed to fetch albums" };
  }
};

export const getAlbumById = async (ctx: Context): Promise<void> => {
  try {
    const { id } = ctx.params;
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: { id }
    });
    
    const response = await client.send(command);
    
    if (!response.Item) {
      ctx.status = 404;
      ctx.body = { error: 'Album not found' };
      return;
    }
    
    ctx.body = response.Item;
  } catch (error) {
    console.error('Error fetching album:', error);
    ctx.status = 500;
    ctx.body = { error: 'Failed to fetch album' };
  }
};

export const createAlbum = async (ctx: Context): Promise<void> => {
  try {
    const album = ctx.request.body as CreateAlbumRequest;
    
    if (!album.title || !album.artist) {
      ctx.status = 400;
      ctx.body = { error: 'Title and artist are required' };
      return;
    }

    const item: Album = {
      id: album.id || Date.now().toString(),
      title: album.title,
      artist: album.artist,
      year: album.year,
      genre: album.genre,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: item
    });
    
    await client.send(command);
    
    ctx.status = 201;
    ctx.body = item;
  } catch (error) {
    console.error('Error creating album:', error);
    ctx.status = 500;
    ctx.body = { error: 'Failed to create album' };
  }
};
