 import { Router, type IRouter } from "express";
  import { createLiveKitToken } from "../../controllers/livekit.controller.js";
  import { livekitTokenRateLimit } from "../../middleware/rateLimit.js";
  import { requireSession } from "../../middleware/session.js";

const livekitRouter: IRouter = Router();

livekitRouter.post("/token", livekitTokenRateLimit, requireSession, createLiveKitToken);

export default livekitRouter;
