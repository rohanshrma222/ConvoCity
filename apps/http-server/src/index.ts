import "dotenv/config";
import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";

const app = express();
const PORT = process.env.PORT || 3002;

// ── Better Auth routes ────────────────────────────────────────────
// Must come BEFORE express.json() middleware
app.all("/api/auth/*splat", toNodeHandler(auth));

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
