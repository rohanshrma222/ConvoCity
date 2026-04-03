 import { Router, type IRouter } from "express";
  import { requireSession } from "../../middleware/session.js";
  import { createLiveKitToken } from "../../controllers/livekit.controller.js";

const livekitRouter: IRouter = Router();

livekitRouter.post("/token", requireSession, createLiveKitToken);

export default livekitRouter;