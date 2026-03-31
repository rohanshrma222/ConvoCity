import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

type ErrorWithStatus = Error & {
  code?: string;
  statusCode?: number;
};

export function errorHandler(
  error: ErrorWithStatus,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: error.issues[0]?.message || "Validation failed",
    });
    return;
  }

  if (error.code === "P2002") {
    res.status(409).json({
      success: false,
      error: "Resource conflict",
    });
    return;
  }

  res.status(error.statusCode ?? 500).json({
    success: false,
    error: error.statusCode ? error.message : "Unexpected server error",
  });
}
