import Router from "@koa/router";
import { getRecentAlbumReviewsData } from "../controllers/reviews/get-recent-album-reviews-data.controller";

const router = new Router();

router.get("/recent-album-reviews", getRecentAlbumReviewsData);

export default router;
