import Router from "@koa/router";
import { getMyAlbumReviews } from "../controllers/reviews/get-my-reviews.contoller";
import { getRecentAlbumReviewsData } from "../controllers/reviews/get-recent-album-reviews-data.controller";
import { authMiddleware } from "../middleware/auth";

const router = new Router();

router.get("/recent-album-reviews", getRecentAlbumReviewsData);

router.get("/my-album-reviews", authMiddleware, getMyAlbumReviews);

export default router;
