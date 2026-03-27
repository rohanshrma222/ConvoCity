import { Router, type IRouter } from "express";
import { getTemplateById, listTemplates } from "../../controllers/template.controller.js";

const templateRouter: IRouter = Router();

templateRouter.get("/", listTemplates);
templateRouter.get("/:id", getTemplateById);

export default templateRouter;
