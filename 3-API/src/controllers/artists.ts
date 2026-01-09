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
