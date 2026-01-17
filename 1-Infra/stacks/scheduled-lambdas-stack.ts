import * as cdk from "aws-cdk-lib/core";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambdaEventSources from "aws-cdk-lib/aws-lambda-event-sources";
import { Construct } from "constructs";

interface MusakorneriScheduledLambdasStackProps extends cdk.StackProps {
  musicBrainzQueue: sqs.Queue;
  filesBucket: s3.Bucket;
}

export class MusakorneriScheduledLambdasStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    props: MusakorneriScheduledLambdasStackProps
  ) {
    super(scope, id, props);

    const { musicBrainzQueue, filesBucket } = props;

    // MusicBrainz Queue Processor Lambda (SQS-triggered)
    const processMusicBrainzQueueLambda = new lambda.Function(
      this,
      "ProcessMusicBrainzQueue",
      {
        runtime: lambda.Runtime.NODEJS_24_X,
        handler: "dist/lambdas/process-musicbrainz-sqs.handler",
        code: lambda.Code.fromAsset("../6-ScheduledLambdas"),
        timeout: cdk.Duration.seconds(30),
        memorySize: 256,
        environment: {
          MUSICBRAINZ_QUEUE_URL: musicBrainzQueue.queueUrl,
          FILES_BUCKET_NAME: filesBucket.bucketName,
        },
      }
    );

    // SQS trigger with batch size 1 for rate limiting
    processMusicBrainzQueueLambda.addEventSource(
      new lambdaEventSources.SqsEventSource(musicBrainzQueue, {
        batchSize: 1,
        maxBatchingWindow: cdk.Duration.seconds(1),
      })
    );

    // Grant permissions
    musicBrainzQueue.grantConsumeMessages(processMusicBrainzQueueLambda);
    filesBucket.grantWrite(processMusicBrainzQueueLambda);

    // Grant DynamoDB permissions
    processMusicBrainzQueueLambda.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "dynamodb:UpdateItem",
          "dynamodb:GetItem",
          "dynamodb:PutItem"
        ],
        resources: [cdk.Fn.importValue("MusakorneriAlbumsTableArn")]
      })
    );
  }
}
