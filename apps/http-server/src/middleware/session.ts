import type { NextFunction, Request, Response } from "express";
import { auth } from "@repo/auth";

function toHeaders(headers: Request["headers"]): Headers {
  const normalized = new Headers();

  for (const [key, value] of Object.entries(headers)) {
    if (Array.isArray(value)) {
      for (const entry of value) {
        normalized.append(key, entry);
      }
      continue;
    }

    if (typeof value === "string") {
      normalized.set(key, value);
    }
  }

  return normalized;
}

function unauthorizedError() {
  const error = new Error("Unauthorized") as Error & { statusCode?: number };
  error.statusCode = 401;
  return error;
}

export async function sessionMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const session = await auth.api.getSession({
      headers: toHeaders(req.headers),
    });

    req.authSession = session ?? null;
    req.authUser = session?.user ?? null;
  } catch {
    req.authSession = null;
    req.authUser = null;
  }

  next();
}

export async function requireSession(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  await sessionMiddleware(req, res, () => undefined);

  if (!req.authSession || !req.authUser) {
    next(unauthorizedError());
    return;
  }

  next();
}
