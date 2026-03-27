import type { Session } from "@repo/auth";

declare global {
  namespace Express {
    interface Request {
      authSession?: Session | null;
      authUser?: Session["user"] | null;
    }
  }
}

export {};
