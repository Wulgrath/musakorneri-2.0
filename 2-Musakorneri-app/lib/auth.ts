import { SignUpCommand, InitiateAuthCommand, ConfirmSignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { cognitoClient, cognitoConfig } from "./cognito";

export async function signUp(email: string, password: string) {
  const command = new SignUpCommand({
    ClientId: cognitoConfig.clientId,
    Username: email,
    Password: password,
    UserAttributes: [
      {
        Name: "email",
        Value: email,
      },
    ],
  });

  return await cognitoClient.send(command);
}

export async function confirmSignUp(email: string, code: string) {
  const command = new ConfirmSignUpCommand({
    ClientId: cognitoConfig.clientId,
    Username: email,
    ConfirmationCode: code,
  });

  return await cognitoClient.send(command);
}

export async function signIn(email: string, password: string) {
  const command = new InitiateAuthCommand({
    ClientId: cognitoConfig.clientId,
    AuthFlow: "USER_PASSWORD_AUTH",
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  });

  return await cognitoClient.send(command);
}