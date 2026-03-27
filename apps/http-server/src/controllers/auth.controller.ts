import type { Request, Response } from "express";
import { prisma } from "@repo/db";

export async function getCurrentUser(req: Request, res: Response): Promise<void> {
  if (!req.authUser) {
    res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
    return;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: req.authUser.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  if (!user) {
    res.status(404).json({
      success: false,
      error: "User not found",
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: {
      id: user.id,
      username: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
}
