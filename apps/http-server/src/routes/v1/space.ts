import { Router, type IRouter } from "express";
import {
  createSpace,
  deleteSpace,
  getSpaceById,
  joinSpace,
  listMembers,
  listSpaces,
  regenerateInviteCode,
  updateSpace,
} from "../../controllers/space.controller.js";
import { getSpaceAvatars, updateAvatarPosition } from "../../controllers/avatar.controller.js";
import { requireSession } from "../../middleware/session.js";

const spaceRouter: IRouter = Router();

spaceRouter.use(requireSession);
spaceRouter.get("/", listSpaces);
spaceRouter.post("/", createSpace);
spaceRouter.post("/join", joinSpace);
spaceRouter.get("/:id", getSpaceById);
spaceRouter.patch("/:id", updateSpace);
spaceRouter.delete("/:id", deleteSpace);
spaceRouter.get("/:id/members", listMembers);
spaceRouter.post("/:id/invite-code/regenerate", regenerateInviteCode);
spaceRouter.patch("/:id/avatar", updateAvatarPosition);
spaceRouter.get("/:id/avatars", getSpaceAvatars);

export default spaceRouter;
