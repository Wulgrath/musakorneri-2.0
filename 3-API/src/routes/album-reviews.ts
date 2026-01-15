import Router from "@koa/router";
import { getMyAlbumReviews } from "../controllers/reviews/get-my-reviews.contoller";
import { getRecentAlbumReviewsData } from "../controllers/reviews/get-recent-album-reviews-data.controller";
import { authMiddleware } from "../middleware/auth";
import { updateAlbumReview } from "../controllers/reviews/update-album-review.controller";

const router = new Router();

router.get("/recent-album-reviews", getRecentAlbumReviewsData);

router.get("/my-album-reviews", authMiddleware, getMyAlbumReviews);

router.patch(
  "/album/:albumId/update-album-review",
  authMiddleware,
  updateAlbumReview
);

export default router;
