import { Context } from "koa";
import { dynamodbGetUserById } from "../../services/dynamodb/user/dynamodb-get-user-by-id.service";

export const getCurrentUser = async (ctx: Context): Promise<void> => {
  const { userId } = ctx.state;

  const user = await dynamodbGetUserById(userId);

  if (!user) {
    ctx.throw(404, "USER NOT FOUND");
  }

  ctx.body = {
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
  };
};
