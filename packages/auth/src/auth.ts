import "dotenv/config";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@repo/db";

const betterAuthUrl = (process.env.BETTER_AUTH_URL || "http://localhost:3002").replace(/\/+$/, "");
const webUrl = (process.env.WEB_URL || "http://localhost:3000").replace(/\/+$/, "");
// Cookie security must track the actual scheme in use, not NODE_ENV: Render
// doesn't set NODE_ENV=production for web services, so gating on it left
// state cookies as sameSite=lax/non-secure in production, which cross-site
// browsers drop between the sign-in request and the OAuth callback (the
// frontend and backend live on different *.onrender.com sites) and surfaces
// as a state_mismatch error.
const isProduction = betterAuthUrl.startsWith("https://");

export const auth = betterAuth({
  baseURL: betterAuthUrl,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  trustedOrigins: [
    betterAuthUrl,
    webUrl,
  ],
  onAPIError: {
    errorURL: `${webUrl}/sign-in`,
  },
  advanced: {
    useSecureCookies: isProduction,
    defaultCookieAttributes: {
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
