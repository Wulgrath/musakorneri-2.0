import * as cdk from "aws-cdk-lib/core";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambdaEventSources from "aws-cdk-lib/aws-lambda-event-sources";
import { Construct } from "constructs";

interface MusakorneriReactiveLambdasStackProps extends cdk.StackProps {
  albumReviewsTable: dynamodb.Table;
  albumsTable: dynamodb.Table;
}

export class MusakorneriReactiveLambdasStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    props: MusakorneriReactiveLambdasStackProps
  ) {
    super(scope, id, props);

    const { albumReviewsTable, albumsTable } = props;

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

    // Add DynamoDB Stream trigger
    updateAlbumLambda.addEventSource(
      new lambdaEventSources.DynamoEventSource(albumReviewsTable, {
        startingPosition: lambda.StartingPosition.LATEST,
        batchSize: 1,
        retryAttempts: 3,
      })
    );

    // Grant permissions
    albumReviewsTable.grantStreamRead(updateAlbumLambda);
    albumReviewsTable.grantReadData(updateAlbumLambda);
    albumsTable.grantReadWriteData(updateAlbumLambda);
  }
}
