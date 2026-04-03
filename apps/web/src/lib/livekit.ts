"use client";

import { apiFetch } from "@/lib/api";

export type LiveKitTokenResponse = {
  token: string;
  url: string;
  roomName: string;
  identity: string;
  participantName: string;
};

export async function fetchLiveKitToken(spaceId: string) {
  const response = await apiFetch<LiveKitTokenResponse>("/livekit/token", {
    method: "POST",
    body: JSON.stringify({ spaceId }),
  });

  return response.data;
}
