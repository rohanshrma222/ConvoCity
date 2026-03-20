// Server-side exports (use in http-server / API routes)
export { auth } from "./auth";
export type { Session, User } from "./auth";

// Client-side exports (use in web / frontend)
export { authClient, signIn, signUp, signOut, useSession } from "./auth-client";

