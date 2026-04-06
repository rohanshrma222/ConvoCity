import type { Request, Response } from "express";
import { AccessToken, TrackSource, type VideoGrant } from "livekit-server-sdk";
import { prisma } from "@repo/db"

type AppError = Error & {statusCode?: number };

function createError(message: string, statusCode: number): AppError {
    const error = new Error(message) as AppError;
    error.statusCode = statusCode;
    return error;
}

function requireAuthUser(req: Request) {
    if(!req.authUser){
        throw createError("Unauthorized", 401)
    }
    return req.authUser;
}

function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
      throw createError(`${name} is not configured`, 500);
    }
    return value;
  }

export async function createLiveKitToken(req: Request, res: Response): Promise<void> {
    const user = requireAuthUser(req);
    const { spaceId } = req.body as { spaceId?: string };

    if (!spaceId || typeof spaceId !== "string") {
      throw createError("spaceId is required", 400);
    }

    const membership = await prisma.spaceMember.findUnique({
      where: {
        spaceId_userId: {
          spaceId,
          userId: user.id,
        },
      },
      include: {
        space: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!membership) {
      throw createError("You are not a member of this space", 403);
    }

    const roomName = `space:${spaceId}`;

    const at = new AccessToken(
      requireEnv("LIVEKIT_API_KEY"),
      requireEnv("LIVEKIT_API_SECRET"),
      {
        identity: user.id,
        name: user.name,
        metadata: JSON.stringify({
          userId: user.id,
          spaceId,
        }),
        ttl: "15m",
      },
    );

    const videoGrant: VideoGrant = {
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
      canPublishSources: [TrackSource.MICROPHONE, TrackSource.CAMERA],
    };

    at.addGrant(videoGrant);

    const token = await at.toJwt();
    const url = requireEnv("LIVEKIT_URL");

    res.status(200).json({
      success: true,
      data: {
        token,
        url,
        roomName,
        identity: user.id,
        participantName: user.name,
      },
    });
  }  
