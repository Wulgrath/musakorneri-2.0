import Router from "@koa/router";
import { getArtistData } from "../controllers/artists/get-artist-data.controller";
import { getArtistsBaseData } from "../controllers/artists/get-artists-base-data.controller";

const router = new Router();

router.get("/:artistId/artist-data", getArtistData);

router.get("/artists-base-data", getArtistsBaseData);

export default router;
