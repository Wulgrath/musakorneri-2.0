import * as cdk from "aws-cdk-lib";
import * as cognito from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";
import { createPostConfirmationLambda } from "./utils/lambda-utils";

export class AuthStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const postConfirmationLambda = createPostConfirmationLambda(this);

    const userPool = new cognito.UserPool(this, "UserPool", {
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      autoVerify: { email: true },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
      },
      lambdaTriggers: {
        postConfirmation: postConfirmationLambda,
      },
    });

    const userPoolClient = userPool.addClient("WebClient", {
      authFlows: {
        userPassword: true,
        userSrp: true,
      },
      generateSecret: false,
    });

    new cdk.CfnOutput(this, "UserPoolId", {
      value: userPool.userPoolId,
      exportName: "MusakorneriUserPoolId",
    });

    new cdk.CfnOutput(this, "ClientId", {
      value: userPoolClient.userPoolClientId,
      exportName: "MusakorneriClientId",
    });
  }
}
