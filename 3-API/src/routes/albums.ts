import Router from "@koa/router";
import { getAllAlbums, getAlbumById, createAlbum } from "../controllers/albums";

const router = new Router();

// GET /albums - Get all albums
router.get("/", getAllAlbums);

// GET /albums/:id - Get album by ID
router.get("/:id", getAlbumById);

// POST /albums - Create new album
router.post("/", createAlbum);

export default router;
