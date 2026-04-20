import rateLimit from "express-rate-limit";

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: "Too many auth requests. Please try again in a few minutes.",
    },
  },
});

export const livekitTokenRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: "Too many LiveKit token requests. Please wait and try again.",
    },
  },
});
