import { Router, type IRouter } from "express";
import authV1Router from "./auth.js";
import avatarRouter from "./avatar.js";
import spaceRouter from "./space.js";
import templateRouter from "./template.js";
import livekitRouter from "./livekit.js";

const router: IRouter = Router();

router.use("/auth", authV1Router);
router.use("/templates", templateRouter);
router.use("/space", spaceRouter);
router.use("/", avatarRouter);
router.use("/livekit", livekitRouter);

export { router };
