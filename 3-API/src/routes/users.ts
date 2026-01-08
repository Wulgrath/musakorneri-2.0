import Router from "@koa/router";
import { getAllUsers, createUser } from "../controllers/users/users";
import { authMiddleware } from "../middleware/auth";
import { getCurrentUser } from "../controllers/users/get-current-user.controller";

const router = new Router();

router.get("/", getAllUsers);
router.get("/me", authMiddleware, getCurrentUser);

router.post("/", createUser);

export default router;
