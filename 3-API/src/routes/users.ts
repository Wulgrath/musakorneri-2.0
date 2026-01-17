import Router from "@koa/router";
import { getCurrentUser } from "../controllers/users/get-current-user.controller";
import { updateUserUsername } from "../controllers/users/update-user-username.controller";
import { authMiddleware } from "../middleware/auth";
import { getUserPageData } from "../controllers/users/get-user-page-data.controller";

const router = new Router();

router.get("/me", authMiddleware, getCurrentUser);
router.patch("/me/update-username", authMiddleware, updateUserUsername);
router.get("/:userId/get-user-data", getUserPageData);

export default router;
