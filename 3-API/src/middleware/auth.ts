import { Context, Next } from "koa";
import { CognitoJwtVerifier } from "aws-jwt-verify";

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID!,
  tokenUse: "access",
  clientId: process.env.COGNITO_CLIENT_ID!,
});

export async function authMiddleware(ctx: Context, next: Next) {
  const authHeader = ctx.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    ctx.status = 401;
    ctx.body = { error: "Authorization token required" };
    return;
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const payload = await verifier.verify(token);
    
    ctx.state.userId = payload.sub;
    ctx.state.email = payload.email;
    ctx.state.username = payload.username;

    await next();
  } catch (error: any) {
    ctx.status = 401;
    ctx.body = { error: "Invalid token" };
  }
}
