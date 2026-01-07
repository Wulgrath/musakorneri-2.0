import * as lambda from "aws-cdk-lib/aws-lambda";
import * as iam from "aws-cdk-lib/aws-iam";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

export const createPostConfirmationLambda = (
  scope: Construct
): lambda.Function => {
  const postConfirmationLambda = new lambda.Function(
    scope,
    "PostConfirmationTrigger",
    {
      runtime: lambda.Runtime.NODEJS_24_X,
      handler: "index.handler",
      code: lambda.Code.fromInline(`
        const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
        const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
        
        const client = DynamoDBDocumentClient.from(new DynamoDBClient());
        
        exports.handler = async (event) => {
          try {
            console.log('Event received:', JSON.stringify(event, null, 2));
            const { sub, email } = event.request.userAttributes;
            console.log('Sub:', sub, 'Email:', email);
            
            const user = {
              id: sub,
              username: 'User' + sub.replace(/-/g, '').substring(0, 8),
              email: email,
              createdAt: new Date().toISOString()
            };
            
            console.log('User object:', JSON.stringify(user, null, 2));
            
            const command = new PutCommand({
              TableName: process.env.USERS_TABLE_NAME,
              Item: user
            });
            
            await client.send(command);
            console.log('User created in DynamoDB:', sub);
          } catch (error) {
            console.error('Error creating user in DynamoDB:', error);
          }
          
          return event;
        };
      `),
      environment: {
        USERS_TABLE_NAME: "musakorneri-users-table",
      },
    }
  );

  postConfirmationLambda.addToRolePolicy(
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["dynamodb:PutItem"],
      resources: [cdk.Fn.importValue("MusakorneriUsersTableArn")],
    })
  );

  return postConfirmationLambda;
};
