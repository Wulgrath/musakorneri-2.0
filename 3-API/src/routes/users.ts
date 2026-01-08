import Router from "@koa/router";
import { getCurrentUser } from "../controllers/users/get-current-user.controller";
import { updateUserUsername } from "../controllers/users/update-user-username.controller";
import { authMiddleware } from "../middleware/auth";

const router = new Router();

router.get("/me", authMiddleware, getCurrentUser);
router.patch("/me/update-username", authMiddleware, updateUserUsername);

export default router;
