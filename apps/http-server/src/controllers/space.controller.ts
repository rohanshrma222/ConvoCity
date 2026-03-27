import type { Request, Response } from "express";
import { prisma } from "@repo/db";
import {
  createSpaceSchema,
  joinSpaceSchema,
  updateSpaceSchema,
} from "../validators/space.schema.js";

type AppError = Error & { statusCode?: number };
type TemplateRoom = {
  name: string;
  type: string;
  posX: number;
  posY: number;
};

const ROOM_TYPES = new Set(["OFFICE", "LOUNGE", "MEETING", "OPEN"]);
const INVITE_CODE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

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

function mapUserSummary(user: { id: string; name: string; email?: string | null }) {
  return {
    id: user.id,
    username: user.name,
    ...(user.email ? { email: user.email } : {}),
  };
}

function mapMembers<T extends { user: { id: string; name: string; email?: string | null } }>(
  members: T[],
) {
  return members.map((member) => ({
    ...member,
    user: mapUserSummary(member.user),
  }));
}

function buildInviteCode(): string {
  let code = "";

  for (let index = 0; index < 6; index += 1) {
    const randomIndex = Math.floor(Math.random() * INVITE_CODE_ALPHABET.length);
    code += INVITE_CODE_ALPHABET[randomIndex];
  }

  return code;
}

async function generateUniqueInviteCode(): Promise<string> {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const inviteCode = buildInviteCode();
    const existingSpace = await prisma.space.findUnique({
      where: {
        inviteCode,
      },
      select: {
        id: true,
      },
    });

    if (!existingSpace) {
      return inviteCode;
    }
  }

  throw createError("Unable to generate a unique invite code", 500);
}

function parseTemplateRooms(rooms: unknown): TemplateRoom[] {
  if (!Array.isArray(rooms)) {
    throw createError("Template room layout is invalid", 500);
  }

  return rooms.map((room) => {
    if (
      typeof room !== "object" ||
      room === null ||
      typeof room.name !== "string" ||
      typeof room.type !== "string" ||
      !ROOM_TYPES.has(room.type) ||
      !Number.isInteger(room.posX) ||
      !Number.isInteger(room.posY)
    ) {
      throw createError("Template room layout is invalid", 500);
    }

    return {
      name: room.name,
      type: room.type,
      posX: room.posX,
      posY: room.posY,
    };
  });
}

async function getSpaceOrThrow(spaceId: string) {
  const space = await prisma.space.findUnique({
    where: {
      id: spaceId,
    },
    select: {
      id: true,
    },
  });

  if (!space) {
    throw createError("Space not found", 404);
  }
}

async function getMembership(spaceId: string, userId: string) {
  return prisma.spaceMember.findUnique({
    where: {
      spaceId_userId: {
        spaceId,
        userId,
      },
    },
  });
}

async function ensureMembership(spaceId: string, userId: string) {
  await getSpaceOrThrow(spaceId);

  const membership = await getMembership(spaceId, userId);

  if (!membership) {
    throw createError("You are not a member of this space", 403);
  }

  return membership;
}

async function ensureOwner(spaceId: string, userId: string) {
  const membership = await ensureMembership(spaceId, userId);

  if (membership.role !== "OWNER") {
    throw createError("Only the space owner can perform this action", 403);
  }
}

export async function listSpaces(req: Request, res: Response): Promise<void> {
  const user = requireAuthUser(req);

  const spaces = await prisma.space.findMany({
    where: {
      OR: [{ ownerId: user.id }, { members: { some: { userId: user.id } } }],
    },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      template: true,
      _count: {
        select: {
          members: true,
          avatars: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.status(200).json({
    success: true,
    data: spaces.map((space: (typeof spaces)[number]) => ({
      ...space,
      owner: mapUserSummary(space.owner),
    })),
  });
}

export async function createSpace(req: Request, res: Response): Promise<void> {
  const user = requireAuthUser(req);
  const payload = createSpaceSchema.parse(req.body);

  const template = await prisma.template.findUnique({
    where: {
      id: payload.templateId,
    },
  });

  if (!template) {
    throw createError("Template not found", 404);
  }

  const inviteCode = await generateUniqueInviteCode();
  const rooms = parseTemplateRooms(template.rooms);

  const space = await prisma.space.create({
    data: {
      name: payload.name,
      inviteCode,
      ownerId: user.id,
      templateId: template.id,
      members: {
        create: {
          role: "OWNER",
          userId: user.id,
        },
      },
      rooms: {
        create: rooms,
      },
    },
    include: {
      rooms: {
        orderBy: [{ posY: "asc" }, { posX: "asc" }],
      },
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          joinedAt: "asc",
        },
      },
      avatars: true,
      template: true,
    },
  });

  res.status(201).json({
    success: true,
    data: space
      ? {
          ...space,
          members: mapMembers(space.members),
        }
      : null,
  });
}

export async function joinSpace(req: Request, res: Response): Promise<void> {
  const user = requireAuthUser(req);
  const payload = joinSpaceSchema.parse(req.body);

  const space = await prisma.space.findUnique({
    where: {
      inviteCode: payload.inviteCode,
    },
    select: {
      id: true,
    },
  });

  if (!space) {
    throw createError("Space not found", 404);
  }

  const existingMembership = await getMembership(space.id, user.id);

  if (existingMembership) {
    throw createError("You are already a member of this space", 409);
  }

  await prisma.spaceMember.create({
    data: {
      role: "MEMBER",
      spaceId: space.id,
      userId: user.id,
    },
  });

  const joinedSpace = await prisma.space.findUnique({
    where: {
      id: space.id,
    },
    include: {
      rooms: {
        orderBy: [{ posY: "asc" }, { posX: "asc" }],
      },
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          joinedAt: "asc",
        },
      },
      avatars: true,
      template: true,
    },
  });

  // SOCKET: emit('member:joined', { userId, username }) -> to room spaceId

  res.status(200).json({
    success: true,
    data: joinedSpace
      ? {
          ...joinedSpace,
          members: mapMembers(joinedSpace.members),
        }
      : null,
  });
}

export async function getSpaceById(req: Request, res: Response): Promise<void> {
  const user = requireAuthUser(req);
  const spaceId = getRouteSpaceId(req);
  await ensureMembership(spaceId, user.id);

  const space = await prisma.space.findUnique({
    where: {
      id: spaceId,
    },
    include: {
      rooms: {
        orderBy: [{ posY: "asc" }, { posX: "asc" }],
      },
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          joinedAt: "asc",
        },
      },
      avatars: true,
      template: true,
    },
  });

  if (!space) {
    throw createError("Space not found", 404);
  }

  res.status(200).json({
    success: true,
    data: {
      ...space,
      members: mapMembers(space.members),
    },
  });
}

export async function updateSpace(req: Request, res: Response): Promise<void> {
  const user = requireAuthUser(req);
  const payload = updateSpaceSchema.parse(req.body);
  const spaceId = getRouteSpaceId(req);

  await ensureOwner(spaceId, user.id);

  const space = await prisma.space.update({
    where: {
      id: spaceId,
    },
    data: {
      name: payload.name,
    },
    include: {
      rooms: {
        orderBy: [{ posY: "asc" }, { posX: "asc" }],
      },
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          joinedAt: "asc",
        },
      },
      avatars: true,
      template: true,
    },
  });

  // SOCKET: emit('space:updated', { name }) -> to room spaceId

  res.status(200).json({
    success: true,
    data: {
      ...space,
      members: mapMembers(space.members),
    },
  });
}

export async function deleteSpace(req: Request, res: Response): Promise<void> {
  const user = requireAuthUser(req);
  const spaceId = getRouteSpaceId(req);

  await ensureOwner(spaceId, user.id);

  await prisma.space.delete({
    where: {
      id: spaceId,
    },
  });

  // SOCKET: emit('space:deleted') -> to room spaceId

  res.status(200).json({
    success: true,
    data: {
      message: "Space deleted successfully",
    },
  });
}

export async function listMembers(req: Request, res: Response): Promise<void> {
  const user = requireAuthUser(req);
  const spaceId = getRouteSpaceId(req);

  await ensureMembership(spaceId, user.id);

  const members = await prisma.spaceMember.findMany({
    where: {
      spaceId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      joinedAt: "asc",
    },
  });

  res.status(200).json({
    success: true,
    data: mapMembers(members),
  });
}

export async function regenerateInviteCode(req: Request, res: Response): Promise<void> {
  const user = requireAuthUser(req);
  const spaceId = getRouteSpaceId(req);

  await ensureOwner(spaceId, user.id);

  const inviteCode = await generateUniqueInviteCode();

  await prisma.space.update({
    where: {
      id: spaceId,
    },
    data: {
      inviteCode,
    },
  });

  res.status(200).json({
    success: true,
    data: {
      inviteCode,
    },
  });
}
