"use client";

export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiFailure = {
  success: false;
  error: string;
};

type ApiFetchOptions = RequestInit & {
  redirectOnUnauthorized?: boolean;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:3002";

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<ApiSuccess<T>> {
  const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
  const { redirectOnUnauthorized = true, headers, ...rest } = options;

  const response = await fetch(`${API_BASE_URL}/v1${path}`, {
    ...rest,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers ?? {}),
    },
  });

  const payload = (await response.json().catch(() => null)) as ApiSuccess<T> | ApiFailure | null;

  if (response.status === 401 && redirectOnUnauthorized && typeof window !== "undefined") {
    window.location.href = "/sign-in";
    throw new Error("Unauthorized");
  }

  if (!response.ok || !payload || payload.success === false) {
    throw new Error(payload && "error" in payload ? payload.error : "Something went wrong");
  }

  return payload;
}
