import Router from "@koa/router";
import { getAllArtists } from "../controllers/artists";

const router = new Router();

router.get("/", getAllArtists);

export default router;
