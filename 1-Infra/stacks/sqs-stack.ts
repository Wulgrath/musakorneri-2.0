import * as cdk from "aws-cdk-lib/core";
import * as sqs from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";

export class SqsStack extends cdk.Stack {
  public readonly musicBrainzQueue: sqs.Queue;
  public readonly musicBrainzDLQ: sqs.Queue;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Dead Letter Queue for failed MusicBrainz requests
    this.musicBrainzDLQ = new sqs.Queue(this, "MusicBrainzDLQ", {
      queueName: "musicbrainz-dlq",
    });

    // SQS Queue for MusicBrainz API requests
    this.musicBrainzQueue = new sqs.Queue(this, "MusicBrainzQueue", {
      queueName: "musicbrainz-queue",
      visibilityTimeout: cdk.Duration.seconds(30),
      deadLetterQueue: {
        queue: this.musicBrainzDLQ,
        maxReceiveCount: 3,
      },
    });
  }
}
