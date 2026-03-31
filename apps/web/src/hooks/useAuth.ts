"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";

export type AuthUser = {
  id: string;
  username: string;
  email: string;
  createdAt: string;
};

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [, startTransition] = useTransition();

  useEffect(() => {
    let active = true;

    async function loadUser() {
      try {
        const token = window.localStorage.getItem("token");

        if (!token) {
          const response = await apiFetch<AuthUser>("/auth/me", {
            method: "GET",
            redirectOnUnauthorized: false,
          });

          if (!active) {
            return;
          }

          setUser(response.data);
          setLoading(false);
          return;
        }

        const response = await apiFetch<AuthUser>("/auth/me", {
          method: "GET",
        });

        if (!active) {
          return;
        }

        setUser(response.data);
      } catch {
        if (!active) {
          return;
        }

        startTransition(() => {
          router.replace("/sign-in");
        });
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      active = false;
    };
  }, [router, startTransition]);

  const logout = useCallback(async () => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("currentSpaceId");
    window.localStorage.removeItem("avatarData");

    try {
      await signOut();
    } catch {}

    startTransition(() => {
      router.replace("/sign-in");
    });
  }, [router, startTransition]);

  return { user, loading, logout };
}
