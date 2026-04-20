import express, { type Express } from "express";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import { router as v1Router } from "./routes/v1/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { authRateLimit } from "./middleware/rateLimit.js";

const app: Express = express();
const webUrl = (process.env.WEB_URL || "http://localhost:3000").replace(/\/+$/, "");
app.set("trust proxy", 1);

app.use(
  cors({
    origin: webUrl,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/api/auth", authRateLimit, authRouter);
app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: "http-server running",
    },
  });
});

app.use("/v1", v1Router);

app.use((_req, _res, next) => {
  const error = new Error("Route not found") as Error & { statusCode?: number };
  error.statusCode = 404;
  next(error);
});

app.use(errorHandler);

export default app;
