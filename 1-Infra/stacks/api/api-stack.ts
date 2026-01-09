import * as apigatewayv2 from "aws-cdk-lib/aws-apigatewayv2";
import * as integrations from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as cdk from "aws-cdk-lib/core";
import { Construct } from "constructs";

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Import Cognito User Pool
    const userPool = cognito.UserPool.fromUserPoolId(
      this,
      "ImportedUserPool",
      cdk.Fn.importValue("MusakorneriUserPoolId")
    );

    // Import tables from DynamoDB stack
    const albumsTable = dynamodb.Table.fromTableArn(
      this,
      "ImportedAlbumsTable",
      cdk.Fn.importValue("MusakorneriAlbumsTableArn")
    );

    const artistsTable = dynamodb.Table.fromTableArn(
      this,
      "ImportedArtistsTable",
      cdk.Fn.importValue("MusakorneriArtistsTableArn")
    );

    const usersTable = dynamodb.Table.fromTableArn(
      this,
      "ImportedUsersTable",
      cdk.Fn.importValue("MusakorneriUsersTableArn")
    );

    const albumReviewsTable = dynamodb.Table.fromTableArn(
      this,
      "ImportedAlbumReviewsTable",
      cdk.Fn.importValue("MusakorneriAlbumReviewsTableArn")
    );

    // Single Koa API Lambda
    const apiLambda = new lambda.Function(this, "MusakorneriApiFunction", {
      runtime: lambda.Runtime.NODEJS_24_X,
      handler: "dist/app.handler",
      code: lambda.Code.fromAsset("../3-API"),
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
      environment: {
        COGNITO_USER_POOL_ID: userPool.userPoolId,
        COGNITO_CLIENT_ID: cdk.Fn.importValue("MusakorneriClientId"),
      },
    });

    // Grant comprehensive permissions for albums table
    apiLambda.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'dynamodb:GetItem',
          'dynamodb:PutItem',
          'dynamodb:UpdateItem',
          'dynamodb:DeleteItem',
          'dynamodb:BatchGetItem',
          'dynamodb:BatchWriteItem',
          'dynamodb:Query',
          'dynamodb:Scan'
        ],
        resources: [
          albumsTable.tableArn,
          `${albumsTable.tableArn}/index/*`
        ]
      })
    );
    artistsTable.grantReadWriteData(apiLambda);
    usersTable.grantReadWriteData(apiLambda);
    albumReviewsTable.grantReadWriteData(apiLambda);

    const api = new apigatewayv2.HttpApi(this, "MusakorneriApi", {
      apiName: "Musakorneri API",
      corsPreflight: {
        allowOrigins: ["https://musakorneri.in", "http://localhost:3000"],
        allowMethods: [apigatewayv2.CorsHttpMethod.ANY],
        allowHeaders: [
          "Content-Type",
          "Authorization",
          "Accept",
          "X-Requested-With",
        ],
        exposeHeaders: ["Authorization"],
        allowCredentials: true,
      },
    });

    // Add Lambda integration
    api.addRoutes({
      path: "/{proxy+}",
      methods: [apigatewayv2.HttpMethod.ANY],
      integration: new integrations.HttpLambdaIntegration(
        "LambdaIntegration",
        apiLambda
      ),
    });

    new cdk.CfnOutput(this, "ApiUrl", {
      value: api.apiEndpoint,
      description: "Musakorneri API URL",
    });
  }
}
