import { Router, type IRouter } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "@repo/auth";

const router: IRouter = Router();

router.all("/*splat", toNodeHandler(auth));

export default router;
