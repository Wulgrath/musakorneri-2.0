import * as cdk from "aws-cdk-lib/core";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export class DynamodbStack extends cdk.Stack {
  public readonly albumsTable: dynamodb.Table;
  public readonly artistsTable: dynamodb.Table;
  public readonly usersTable: dynamodb.Table;
  public readonly albumReviewsTable: dynamodb.Table;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.albumsTable = new dynamodb.Table(this, "musakorneri-albums-table", {
      tableName: "musakorneri-albums-table",
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      deletionProtection: true,
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
    });

    this.albumsTable.addGlobalSecondaryIndex({
      indexName: "year-reviewScore-index",
      partitionKey: { name: "year", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "reviewScore", type: dynamodb.AttributeType.NUMBER },
    });

    this.artistsTable = new dynamodb.Table(this, "musakorneri-artists-table", {
      tableName: "musakorneri-artists-table",
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      deletionProtection: true,
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
    });

    this.usersTable = new dynamodb.Table(this, "musakorneri-users-table", {
      tableName: "musakorneri-users-table",
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      deletionProtection: true,
      pointInTimeRecoverySpecification: {
        pointInTimeRecoveryEnabled: true,
      },
    });

    this.usersTable.addGlobalSecondaryIndex({
      indexName: "email-index",
      partitionKey: { name: "email", type: dynamodb.AttributeType.STRING },
    });

    this.albumReviewsTable = new dynamodb.Table(
      this,
      "musakorneri-album-reviews-table",
      {
        tableName: "musakorneri-album-reviews-table",
        partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
        removalPolicy: cdk.RemovalPolicy.RETAIN,
        billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
        deletionProtection: true,
        pointInTimeRecoverySpecification: {
          pointInTimeRecoveryEnabled: true,
        },
        stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
      }
    );

    this.albumReviewsTable.addGlobalSecondaryIndex({
      indexName: "createdAt-index",
      partitionKey: { name: "createdAt", type: dynamodb.AttributeType.STRING },
    });

    this.albumReviewsTable.addGlobalSecondaryIndex({
      indexName: "albumId-index",
      partitionKey: { name: "albumId", type: dynamodb.AttributeType.STRING },
    });

    this.albumReviewsTable.addGlobalSecondaryIndex({
      indexName: "userId-albumId-index",
      partitionKey: { name: "userId", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "albumId", type: dynamodb.AttributeType.STRING },
    });

    new cdk.CfnOutput(this, "AlbumsTableArn", {
      value: this.albumsTable.tableArn,
      exportName: "MusakorneriAlbumsTableArn",
    });

    new cdk.CfnOutput(this, "AlbumsTableName", {
      value: this.albumsTable.tableName,
      exportName: "MusakorneriAlbumsTableName",
    });

    new cdk.CfnOutput(this, "ArtistsTableArn", {
      value: this.artistsTable.tableArn,
      exportName: "MusakorneriArtistsTableArn",
    });

    new cdk.CfnOutput(this, "UsersTableArn", {
      value: this.usersTable.tableArn,
      exportName: "MusakorneriUsersTableArn",
    });

    new cdk.CfnOutput(this, "AlbumReviewsTable", {
      value: this.albumReviewsTable.tableArn,
      exportName: "MusakorneriAlbumReviewsTableArn",
    });
  }
}
