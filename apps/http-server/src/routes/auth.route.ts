import { Router, type IRouter } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "@repo/auth";

const router: IRouter = Router();

// Better Auth handles all /api/auth/* routes.
// NOTE: toNodeHandler must be used BEFORE express.json() in the main app.
router.all("/*splat", toNodeHandler(auth));

export default router;
