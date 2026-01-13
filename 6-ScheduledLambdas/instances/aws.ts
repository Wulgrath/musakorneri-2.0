import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";
import { SQSClient } from "@aws-sdk/client-sqs";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export const docClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: "eu-west-1" })
);

export const sqsClient = new SQSClient({ region: "eu-west-1" });

export const s3Client = new S3Client({ region: "eu-west-1" });
