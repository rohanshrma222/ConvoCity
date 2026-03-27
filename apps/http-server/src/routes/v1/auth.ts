import { Router, type IRouter } from "express";
import { getCurrentUser } from "../../controllers/auth.controller.js";
import { requireSession } from "../../middleware/session.js";

const authV1Router: IRouter = Router();

authV1Router.get("/me", requireSession, getCurrentUser);

export default authV1Router;
