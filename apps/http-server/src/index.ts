import "dotenv/config";
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.route.js";

const app = express();
const PORT = process.env.PORT || 3002;

// ── CORS ──────────────────────────────────────────────────────────
// Must come BEFORE all other middleware so preflight OPTIONS requests
// get the correct Allow-Origin header.
app.use(cors({
  origin: process.env.WEB_URL || "http://localhost:3000",
  credentials: true,               // allow cookies (Better Auth session cookies)
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ── Auth routes ───────────────────────────────────────────────────
// Must come BEFORE express.json() — Better Auth handles its own body parsing
app.use("/api/auth", authRouter);

// ── Body parsing ──────────────────────────────────────────────────
app.use(express.json());

// ── Health check ──────────────────────────────────────────────────
app.get("/", (_req, res) => {
  res.json({ message: "http-server running", status: "ok" });
});

// ── Start ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
  console.log(`🔐 Auth routes available at http://localhost:${PORT}/api/auth`);
});


