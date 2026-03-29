import { Router, type IRouter } from "express";
import { createAvatar } from "../../controllers/avatar.controller.js";
import { requireSession } from "../../middleware/session.js";

const avatarRouter: IRouter = Router();

avatarRouter.post("/avatar", requireSession, createAvatar);

export default avatarRouter;
