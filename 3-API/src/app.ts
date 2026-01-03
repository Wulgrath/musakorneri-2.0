import Koa from "koa";
import Router from "@koa/router";
import bodyParser from "@koa/bodyparser";
import serverless from "serverless-http";
import albumsRouter from "./routes/albums";
import artistsRouter from "./routes/artists";
import usersRouter from "./routes/users";

const app = new Koa();
const router = new Router();

app.use(bodyParser());

// Routes
router.use("/albums", albumsRouter.routes());
router.use("/artists", artistsRouter.routes());
router.use("/users", usersRouter.routes());

// Health check
router.get("/health", (ctx) => {
  ctx.body = { status: "OK", timestamp: new Date().toISOString() };
});

app.use(router.routes());
app.use(router.allowedMethods());

// Error handling
app.on("error", (err, ctx) => {
  console.error("Server error:", err);
});

// For local development
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// For serverless deployment
const serverlessHandler = serverless(app);
export const handler = async (event: any, context: any) => {
  return await serverlessHandler(event, context);
};
