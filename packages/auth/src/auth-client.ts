// Must use 'better-auth/react' (not 'better-auth/client') to get the
// useSession React hook. The /client entry gives an Atom, not a hook.
import { createAuthClient } from "better-auth/react";

export const authClient: any = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:3002",
});

// All of these are safe to destructure — signIn/signUp/signOut are async
// functions, and useSession from better-auth/react IS a proper React hook.
export const { signIn, signUp, signOut, useSession } = authClient;
