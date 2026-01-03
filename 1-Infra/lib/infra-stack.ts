import * as cdk from "aws-cdk-lib/core";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const albumsTable = new dynamodb.Table(this, "musakorneri-albums-table", {
      tableName: "musakorneri-albums-table",
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    const artistsTable = new dynamodb.Table(this, "musakorneri-artists-table", {
      tableName: "musakorneri-artists-table",
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    const usersTable = new dynamodb.Table(this, "musakorneri-users-table", {
      tableName: "musakorneri-users-table",
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    // Single Koa API Lambda
    const apiLambda = new lambda.Function(this, "MusakorneriApiFunction", {
      runtime: lambda.Runtime.NODEJS_24_X,
      handler: "dist/app.handler",
      code: lambda.Code.fromAsset("../3-API"),
      timeout: cdk.Duration.seconds(30),
    });

    albumsTable.grantReadWriteData(apiLambda);
    artistsTable.grantReadWriteData(apiLambda);
    usersTable.grantReadWriteData(apiLambda);

    const api = new apigateway.RestApi(this, "MusakorneriApi", {
      restApiName: "Musakorneri API",
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
      },
    });

    // Proxy all requests to single Lambda
    api.root.addProxy({
      defaultIntegration: new apigateway.LambdaIntegration(apiLambda),
      anyMethod: true,
    });

    new cdk.CfnOutput(this, "ApiUrl", {
      value: api.url,
      description: "Musakorneri API URL",
    });
  }
}
