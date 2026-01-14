import { Context, Next } from "koa";
import { CognitoJwtVerifier } from "aws-jwt-verify";

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID!,
  tokenUse: "access",
  clientId: process.env.COGNITO_CLIENT_ID!,
});

export async function authMiddleware(ctx: Context, next: Next) {
  console.log("Auth middleware called for:", ctx.path);
  const authHeader = ctx.headers.authorization;
  console.log("Auth header:", authHeader ? "Present" : "Missing");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("No valid auth header");
    ctx.status = 401;
    ctx.body = { error: "Authorization token required" };
    return;
  }

  const token = authHeader.replace("Bearer ", "");
  console.log("Token preview:", token.substring(0, 20) + "...");

  try {
    const payload = await verifier.verify(token);
    console.log("Token verified successfully for user:", payload.sub);
    
    ctx.state.userId = payload.sub;
    ctx.state.email = payload.email;
    ctx.state.username = payload.username;

    await next();
  } catch (error: any) {
    console.log("Token verification failed:", error.message);
    ctx.status = 401;
    ctx.body = { error: "Invalid token" };
  }
}
