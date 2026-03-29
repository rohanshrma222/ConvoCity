import { z } from "zod";

export const createAvatarSchema = z.object({
  spaceId: z.uuid(),
  displayName: z.string().min(1),
  skinTone: z.string().min(1),
  outfitColor: z.string().min(1),
});

export const updatePositionSchema = z.object({
  posX: z.number().int(),
  posY: z.number().int(),
});
