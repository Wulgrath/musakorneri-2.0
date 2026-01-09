import { SignUpCommand, InitiateAuthCommand, ConfirmSignUpCommand, ResendConfirmationCodeCommand, InitiateAuthCommandOutput } from "@aws-sdk/client-cognito-identity-provider";
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

  const result = await cognitoClient.send(command);
  
  if (result.AuthenticationResult) {
    if (result.AuthenticationResult.AccessToken) {
      localStorage.setItem("accessToken", result.AuthenticationResult.AccessToken);
    }
    if (result.AuthenticationResult.RefreshToken) {
      localStorage.setItem("refreshToken", result.AuthenticationResult.RefreshToken);
    }
  }
  
  return result;
}

export async function resendConfirmationCode(email: string) {
  const command = new ResendConfirmationCodeCommand({
    ClientId: cognitoConfig.clientId,
    Username: email,
  });

  return await cognitoClient.send(command);
}

export async function refreshToken(): Promise<InitiateAuthCommandOutput | null> {
  const storedRefreshToken = localStorage.getItem("refreshToken");
  
  if (!storedRefreshToken) {
    return null;
  }

  try {
    const command = new InitiateAuthCommand({
      ClientId: cognitoConfig.clientId,
      AuthFlow: "REFRESH_TOKEN_AUTH",
      AuthParameters: {
        REFRESH_TOKEN: storedRefreshToken,
      },
    });

    const result = await cognitoClient.send(command);
    
    if (result.AuthenticationResult?.AccessToken) {
      localStorage.setItem("accessToken", result.AuthenticationResult.AccessToken);
      if (result.AuthenticationResult.RefreshToken) {
        localStorage.setItem("refreshToken", result.AuthenticationResult.RefreshToken);
      }
    }
    
    return result;
  } catch (error) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return null;
  }
}

export function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}