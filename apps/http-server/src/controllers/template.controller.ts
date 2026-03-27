import type { Request, Response } from "express";
import { prisma } from "@repo/db";

export async function listTemplates(_req: Request, res: Response): Promise<void> {
  const templates = await prisma.template.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  res.status(200).json({
    success: true,
    data: templates,
  });
}

export async function getTemplateById(req: Request, res: Response): Promise<void> {
  const template = await prisma.template.findUnique({
    where: {
      id: req.params.id,
    },
  });

  if (!template) {
    res.status(404).json({
      success: false,
      error: "Template not found",
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: template,
  });
}
