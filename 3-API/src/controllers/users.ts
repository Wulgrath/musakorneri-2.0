import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { Context } from "koa";
import { User, CreateUserRequest } from "../types";

const client = DynamoDBDocumentClient.from(new DynamoDBClient());
const TABLE_NAME = "musakorneri-users-table";

export const getAllUsers = async (ctx: Context): Promise<void> => {
  try {
    const command = new ScanCommand({ TableName: TABLE_NAME });
    const response = await client.send(command);
    
    ctx.body = response.Items || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    ctx.status = 500;
    ctx.body = { error: 'Failed to fetch users' };
  }
};

export const createUser = async (ctx: Context): Promise<void> => {
  try {
    const user = ctx.request.body as CreateUserRequest;
    
    if (!user.username || !user.email) {
      ctx.status = 400;
      ctx.body = { error: 'Username and email are required' };
      return;
    }

    const item: User = {
      id: user.id || Date.now().toString(),
      username: user.username,
      email: user.email,
      createdAt: new Date().toISOString()
    };

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: item
    });
    
    await client.send(command);
    
    ctx.status = 201;
    ctx.body = item;
  } catch (error) {
    console.error('Error creating user:', error);
    ctx.status = 500;
    ctx.body = { error: 'Failed to create user' };
  }
};
