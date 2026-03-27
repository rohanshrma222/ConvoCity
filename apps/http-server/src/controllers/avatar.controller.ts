import type { Request, Response } from "express";
import { prisma } from "@repo/db";
import { createAvatarSchema, updatePositionSchema } from "../validators/avatar.schema.js";

type AppError = Error & { statusCode?: number };

function createError(message: string, statusCode: number): AppError {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  return error;
}

function requireAuthUser(req: Request) {
  if (!req.authUser) {
    throw createError("Unauthorized", 401);
  }

  return req.authUser;
}

function getRouteSpaceId(req: Request): string {
  const id = req.params.id;

  if (typeof id !== "string" || id.length === 0) {
    throw createError("Space not found", 404);
  }

  return id;
}

async function ensureMembership(spaceId: string, userId: string) {
  const membership = await prisma.spaceMember.findUnique({
    where: {
      spaceId_userId: {
        spaceId,
        userId,
      },
    },
    select: {
      id: true,
    },
  });

  if (!membership) {
    throw createError("You are not a member of this space", 403);
  }
}

export async function createAvatar(req: Request, res: Response): Promise<void> {
  const user = requireAuthUser(req);
  const payload = createAvatarSchema.parse(req.body);

  await ensureMembership(payload.spaceId, user.id);

  const avatar = await prisma.avatar.upsert({
    where: {
      userId_spaceId: {
        userId: user.id,
        spaceId: payload.spaceId,
      },
    },
    update: {
      displayName: payload.displayName,
      skinTone: payload.skinTone,
      outfitColor: payload.outfitColor,
    },
    create: {
      displayName: payload.displayName,
      skinTone: payload.skinTone,
      outfitColor: payload.outfitColor,
      userId: user.id,
      spaceId: payload.spaceId,
    },
  });

  // SOCKET: emit('avatar:joined', avatarData) -> to room spaceId

  res.status(200).json({
    success: true,
    data: avatar,
  });
}

export async function updateAvatarPosition(req: Request, res: Response): Promise<void> {
  const user = requireAuthUser(req);
  const payload = updatePositionSchema.parse(req.body);
  const spaceId = getRouteSpaceId(req);

  const avatar = await prisma.avatar.findUnique({
    where: {
      userId_spaceId: {
        userId: user.id,
        spaceId,
      },
    },
  });

  if (!avatar) {
    throw createError("Avatar not found", 404);
  }

  const updatedAvatar = await prisma.avatar.update({
    where: {
      userId_spaceId: {
        userId: user.id,
        spaceId,
      },
    },
    data: {
      posX: payload.posX,
      posY: payload.posY,
    },
  });

  // SOCKET: emit('avatar:moved', { userId, posX, posY }) -> to room spaceId

  res.status(200).json({
    success: true,
    data: updatedAvatar,
  });
}

export async function getSpaceAvatars(req: Request, res: Response): Promise<void> {
  const user = requireAuthUser(req);
  const spaceId = getRouteSpaceId(req);

  await ensureMembership(spaceId, user.id);

  const avatars = await prisma.avatar.findMany({
    where: {
      spaceId,
    },
    orderBy: {
      displayName: "asc",
    },
  });

  res.status(200).json({
    success: true,
    data: avatars,
  });
}
