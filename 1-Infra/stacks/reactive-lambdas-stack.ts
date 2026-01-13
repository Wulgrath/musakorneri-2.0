import * as cdk from "aws-cdk-lib/core";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
import * as lambdaEventSources from "aws-cdk-lib/aws-lambda-event-sources";
import { Construct } from "constructs";

interface MusakorneriReactiveLambdasStackProps extends cdk.StackProps {
  albumReviewsTable: dynamodb.Table;
  albumsTable: dynamodb.Table;
  artistsTable: dynamodb.Table;
  musicBrainzQueue: sqs.Queue;
}

export class MusakorneriReactiveLambdasStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    props: MusakorneriReactiveLambdasStackProps
  ) {
    super(scope, id, props);

    const { albumReviewsTable, albumsTable, artistsTable, musicBrainzQueue } = props;

    // Update Album After Review Created Lambda
    const updateAlbumLambda = new lambda.Function(
      this,
      "UpdateAlbumAfterReviewEvent",
      {
        runtime: lambda.Runtime.NODEJS_24_X,
        handler: "dist/lambdas/update-album-after-album-review-event.handler",
        code: lambda.Code.fromAsset("../5-ReactiveLambdas"),
        timeout: cdk.Duration.seconds(30),
      }
    );

    // Handle Operations After Albums Table Events Lambda
    const handleAlbumsEventsLambda = new lambda.Function(
      this,
      "HandleOperationsAfterAlbumsTableEvents",
      {
        runtime: lambda.Runtime.NODEJS_24_X,
        handler: "dist/lambdas/handle-operations-after-albums-table-events.handler",
        code: lambda.Code.fromAsset("../5-ReactiveLambdas"),
        timeout: cdk.Duration.seconds(30),
        environment: {
          MUSICBRAINZ_QUEUE_URL: musicBrainzQueue.queueUrl
        }
      }
    );

    // Add DynamoDB Stream triggers
    updateAlbumLambda.addEventSource(
      new lambdaEventSources.DynamoEventSource(albumReviewsTable, {
        startingPosition: lambda.StartingPosition.LATEST,
        batchSize: 1,
        retryAttempts: 3,
      })
    );

    handleAlbumsEventsLambda.addEventSource(
      new lambdaEventSources.DynamoEventSource(albumsTable, {
        startingPosition: lambda.StartingPosition.LATEST,
        batchSize: 1,
        retryAttempts: 3,
      })
    );

    // Grant permissions
    albumReviewsTable.grantStreamRead(updateAlbumLambda);
    albumReviewsTable.grantReadData(updateAlbumLambda);
    albumsTable.grantReadWriteData(updateAlbumLambda);

    albumsTable.grantStreamRead(handleAlbumsEventsLambda);
    artistsTable.grantReadData(handleAlbumsEventsLambda);
    musicBrainzQueue.grantSendMessages(handleAlbumsEventsLambda);
  }
}
