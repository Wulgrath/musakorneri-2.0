import { Context } from "koa";
import { dynamodbGetUserById } from "../../services/dynamodb/user/dynamodb-get-user-by-id.service";
import { dynamodbUpdateUserUsername } from "../../services/dynamodb/user/dynamodb-update-user-username.service";

export const updateUserUsername = async (ctx: Context): Promise<void> => {
  const userId = ctx.state.userId;

  const { newUsername } = ctx.request.body;

  const user = await dynamodbGetUserById(userId);

  if (!user) {
    ctx.throw(404, "USER NOT FOUND");
  }

  const updatedUser = await dynamodbUpdateUserUsername(userId, newUsername);

  ctx.body = updatedUser;
};
