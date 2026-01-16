import Router from "@koa/router";
import { getArtistData } from "../controllers/artists/get-artist-data.controller";

const router = new Router();

router.get("/:artistId/artist-data", getArtistData);

export default router;
