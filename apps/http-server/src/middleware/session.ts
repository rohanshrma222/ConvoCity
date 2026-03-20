import { Request, Response, NextFunction } from "express";
import { auth } from "@repo/auth";

export interface AuthRequest extends Request {
  session?: typeof auth.$Infer.Session | null;
}

/**
 * Middleware to attach the Better Auth session to req.session.
 * Usage: app.use(sessionMiddleware) or on specific routes.
 */
export async function sessionMiddleware(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const session = await auth.api.getSession({
      headers: new Headers(req.headers as Record<string, string>),
    });
    req.session = session;
  } catch {
    req.session = null;
  }
  next();
}

/**
 * Guard middleware — rejects unauthenticated requests with 401.
 */
export async function requireSession(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  await sessionMiddleware(req, res, () => {});
  if (!req.session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}
