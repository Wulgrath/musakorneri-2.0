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
