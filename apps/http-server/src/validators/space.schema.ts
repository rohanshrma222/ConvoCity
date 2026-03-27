import { z } from "zod/v4/index.js";

export const createSpaceSchema = z.object({
  name: z.string().min(1).max(50),
  templateId: z.uuid(),
});

export const joinSpaceSchema = z.object({
  inviteCode: z.string().length(6),
});

export const updateSpaceSchema = z.object({
  name: z.string().min(1).max(50),
});
