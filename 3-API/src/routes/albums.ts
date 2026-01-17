import Router from "@koa/router";
import { addAndReviewAlbum } from "../controllers/albums/add-and-review-album.controller";
import { getAlbumChartAlbumsData } from "../controllers/albums/get-album-chart-albums-data.controller";
import { authMiddleware } from "../middleware/auth";

const router = new Router();

router.get("/album-chart-data/:year", getAlbumChartAlbumsData);

router.post("/add-and-review-album", authMiddleware, addAndReviewAlbum);

export default router;
