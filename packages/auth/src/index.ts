// Server-side exports (use in http-server / API routes)
export { auth } from "./auth.js";
export type { Session, User } from "./auth.js";

// Client-side exports (use in web / frontend)
export { authClient, signIn, signUp, signOut, useSession } from "./auth-client.js";
