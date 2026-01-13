#!/usr/bin/env node
import * as cdk from "aws-cdk-lib/core";
import { ApiStack } from "../stacks/api/api-stack";
import { DynamodbStack } from "../stacks/dynamodb/dynamodb-stack";
import { FrontendStack } from "../stacks/frontend-stack";
import { AuthStack } from "../stacks/auth/auth-stack";
import { MusakorneriReactiveLambdasStack } from "../stacks/reactive-lambdas-stack";
import { MusakorneriScheduledLambdasStack } from "../stacks/scheduled-lambdas-stack";
import { SqsStack } from "../stacks/sqs-stack";
import { S3Stack } from "../stacks/s3-stack";

const app = new cdk.App();

const dynamodbStack = new DynamodbStack(app, "MusakorneriDynamodbStack");
const s3Stack = new S3Stack(app, "MusakorneriS3Stack");
new ApiStack(app, "MusakorneriApiStack");
new AuthStack(app, "MusakorneriAuthStack");
new FrontendStack(app, "MusakorneriFrontendStack");
const sqsStack = new SqsStack(app, "MusakorneriSqsStack");
new MusakorneriReactiveLambdasStack(app, "MusakorneriReactiveLambdasStack", {
  albumReviewsTable: dynamodbStack.albumReviewsTable,
  albumsTable: dynamodbStack.albumsTable,
  artistsTable: dynamodbStack.artistsTable,
  musicBrainzQueue: sqsStack.musicBrainzQueue,
});
new MusakorneriScheduledLambdasStack(app, "MusakorneriScheduledLambdasStack", {
  musicBrainzQueue: sqsStack.musicBrainzQueue,
  filesBucket: s3Stack.filesBucket,
});
