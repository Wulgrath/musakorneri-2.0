import Router from "@koa/router";
import { getAlbumById, getAllAlbums } from "../controllers/albums";
import { authMiddleware } from "../middleware/auth";
import { addAndReviewAlbum } from "../controllers/albums/add-and-review-album.controller";

const router = new Router();

// GET /albums - Get all albums
router.get("/", getAllAlbums);

// GET /albums/:id - Get album by ID
router.get("/:id", getAlbumById);

router.post("/add-and-review-album", authMiddleware, addAndReviewAlbum);

export default router;
