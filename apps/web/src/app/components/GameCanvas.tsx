"use client";

import { useEffect, useMemo, useRef, useState, useTransition, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { ChevronDown, Grid2x2, Mic, MicOff, MonitorUp, SmilePlus, Video, VideoOff } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/toast";
import LiveKitMicTest, { type LiveKitMediaHandle } from "@/components/LiveKitMicTest";

const PhaserGame = dynamic(() => import("./PhaserGame"), { ssr: false });

export type MapRoom = {
  name: string;
  type: "OFFICE" | "MEETING" | "OPEN" | "LOUNGE";
  posX: number;
  posY: number;
};

export type PlayerPosition = {
  userId: string;
  x: number;
  y: number;
};

type SpaceResponse = {
  id?: string;
  name?: string;
  ownerId?: string;
  inviteCode?: string;
  rooms?: MapRoom[];
  avatars?: Array<{
    id: string;
    userId: string;
    displayName: string;
    skinTone: string;
    outfitColor: string;
  }>;
  template?: {
    rooms?: MapRoom[];
  };
  members?: Array<{
    id: string;
    userId: string;
  }>;
};

interface GameCanvasProps {
  roomId: string;
}

function DockControl({
  icon,
  onClick,
  danger = false,
  wide = false,
}: {
  icon: ReactNode;
  onClick?: () => void;
  danger?: boolean;
  wide?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex h-11 items-center justify-center rounded-2xl border transition-colors duration-150 ease-out ${
        wide ? "w-[52px]" : "w-11"
      } ${
        danger
          ? "border-[#f3d4d2] bg-[#fff7f6] text-[#ea4335] hover:bg-[#fff0ee]"
          : "border-[#ececef] bg-white text-[#6b7280] hover:bg-[#f7f7f8]"
      }`}
      type="button"
    >
      {icon}
    </button>
  );
}

export default function GameCanvas({ roomId }: GameCanvasProps) {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const liveKitControlsRef = useRef<LiveKitMediaHandle | null>(null);
  const [mapData, setMapData] = useState<{
    rooms: MapRoom[];
    avatars: Array<{
      id: string;
      userId: string;
      displayName: string;
      skinTone: string;
      outfitColor: string;
    }>;
    currentUserId: string;
  } | null>(null);
  const [spaceMeta, setSpaceMeta] = useState<{
    name: string;
    ownerId: string;
    inviteCode: string;
    memberCount: number;
  } | null>(null);
  const [playerPositions, setPlayerPositions] = useState<PlayerPosition[]>([]);
  const [mediaState, setMediaState] = useState({
    micEnabled: false,
    cameraEnabled: false,
    connected: false,
  });
  const [inviteOpen, setInviteOpen] = useState(false);
  const [regenerating, startRegenerateTransition] = useTransition();

  const currentUserId = user?.id ?? null;

  useEffect(() => {
    if (authLoading || !currentUserId) {
      return;
    }

    const resolvedUserId = currentUserId;
    let active = true;

    async function loadMap() {
      try {
        const response = await apiFetch<SpaceResponse>(`/space/${roomId}`);
        const rooms = response.data.rooms ?? response.data.template?.rooms ?? [];
        const avatars = response.data.avatars ?? [];
        const members = response.data.members ?? [];

        if (active) {
          setMapData({
            rooms,
            avatars,
            currentUserId: resolvedUserId,
          });
          setSpaceMeta({
            name: response.data.name ?? "Untitled Space",
            ownerId: response.data.ownerId ?? "",
            inviteCode: response.data.inviteCode ?? "",
            memberCount: members.length,
          });
        }
      } catch {
        if (active) {
          setMapData({
            rooms: [],
            avatars: [],
            currentUserId: resolvedUserId,
          });
          setSpaceMeta(null);
        }
      }
    }

    loadMap();

    return () => {
      active = false;
    };
  }, [authLoading, currentUserId, roomId]);

  const inviteLink = useMemo(() => {
    if (!spaceMeta?.inviteCode) {
      return "";
    }

    return `${window.location.origin}/v1/space?inviteCode=${spaceMeta.inviteCode}`;
  }, [spaceMeta?.inviteCode]);

  const isOwner = Boolean(spaceMeta && currentUserId && spaceMeta.ownerId === currentUserId);

  async function handleCopyInvite() {
    if (!spaceMeta?.inviteCode) {
      return;
    }

    try {
      await navigator.clipboard.writeText(inviteLink);
      toast({
        title: "Invite link copied",
        variant: "success",
      });
    } catch {
      toast({
        title: "Unable to copy invite info",
        variant: "error",
      });
    }
  }

  async function handleRegenerateInvite() {
    startRegenerateTransition(async () => {
      try {
        const response = await apiFetch<{ inviteCode: string }>(`/space/${roomId}/invite-code/regenerate`, {
          method: "POST",
        });

        setSpaceMeta((current) =>
          current
            ? {
                ...current,
                inviteCode: response.data.inviteCode,
              }
            : current,
        );

        toast({
          title: "Invite code refreshed",
          variant: "success",
        });
      } catch (error) {
        toast({
          title: error instanceof Error ? error.message : "Unable to regenerate invite code",
          variant: "error",
        });
      }
    });
  }

  if (!mapData || authLoading) {
    return (
      <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#F5F4F8] font-sans">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="absolute h-[400px] w-[400px] rounded-full bg-[#B39DDB]/20 blur-[90px]" />
        </div>
        <div className="z-10 flex flex-col items-center gap-6">
          <div className="relative flex h-16 w-16 items-center justify-center">
            <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-[#EDE7F6] border-t-[#7042b3]"></div>
            <div className="absolute h-8 w-8 animate-pulse rounded-full bg-[#B39DDB]/40"></div>
          </div>
          <p className="text-[15px] font-semibold tracking-wide text-[#6B6B8A] animate-pulse">Entering the studio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full">
      <div className="absolute right-5 top-[76px] z-20 w-[160px] h-[150px]">
        <LiveKitMicTest
          currentUserId={currentUserId ?? ""}
          onMediaStateChange={setMediaState}
          playerPositions={playerPositions}
          ref={liveKitControlsRef}
          spaceId={roomId}
        />
      </div>

      {isOwner ? (
        <div className="pointer-events-none absolute right-5 top-5 z-20 flex items-center gap-3">
          {/* Member count pill */}
          <div className="pointer-events-auto flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-[#2a2d42] shadow-[0_18px_50px_rgba(10,12,24,0.28)]">
            <span className="text-sm font-semibold">👥 {spaceMeta?.memberCount ?? 0}</span>
          </div>

          {/* Invite button + anchored dropdown */}
          <div className="pointer-events-auto relative">
            <button
              className="rounded-xl bg-[#6c63ff] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              onClick={() => setInviteOpen((v) => !v)}
              type="button"
            >
              Invite
            </button>

            {inviteOpen ? (
              <>
                {/* Click-away overlay */}
                <div
                  aria-hidden="true"
                  className="fixed inset-0 z-10"
                  onClick={() => setInviteOpen(false)}
                />

                {/* Popover panel */}
                <div
                  className="absolute right-0 top-full z-20 mt-2 w-[340px] overflow-hidden rounded-2xl border border-[#e7eaf4] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.22)]"
                  style={{ color: "initial" }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-[#edf0f8] px-5 py-4">
                    <span className="text-[15px] font-bold text-[#1a1d2e]">Invite users to your Space</span>
                    <button
                      aria-label="Close invite panel"
                      className="flex h-7 w-7 items-center justify-center rounded-full text-[#9aa1bc] transition-colors hover:bg-[#f3f5fb] hover:text-[#1a1d2e]"
                      onClick={() => setInviteOpen(false)}
                      type="button"
                    >
                      <svg fill="none" height="14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="14"><path d="M18 6 6 18M6 6l12 12"/></svg>
                    </button>
                  </div>

                  <div className="space-y-4 p-5">
                    {/* Entry Code row */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-baseline gap-3">
                        <span className="text-sm font-semibold text-[#1a1d2e]">Entry Code</span>
                        <span className="text-[22px] font-bold tracking-tight text-[#6c63ff]">
                          {spaceMeta?.inviteCode ?? "------"}
                        </span>
                      </div>
                      <button
                        className="text-xs text-[#9aa1bc] underline-offset-2 hover:text-[#6c63ff] hover:underline disabled:opacity-50"
                        disabled={regenerating}
                        onClick={handleRegenerateInvite}
                        type="button"
                      >
                        {regenerating ? "Refreshing…" : "Regenerate"}
                      </button>
                    </div>

                    {/* Invite link */}
                    <div className="flex items-center gap-2 rounded-xl border border-[#dde2f0] bg-[#f8f9fd] px-3 py-2.5">
                      <input
                        className="min-w-0 flex-1 bg-transparent text-[13px] text-[#2a2d42] outline-none"
                        id="invite-link"
                        readOnly
                        value={inviteLink}
                      />
                      <button
                        aria-label="Copy invite link"
                        className="shrink-0 text-[#9aa1bc] transition-colors hover:text-[#6c63ff]"
                        onClick={handleCopyInvite}
                        type="button"
                      >
                        <svg fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="16"><rect height="13" rx="2" width="13" x="9" y="9"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                      </button>
                    </div>

                    {/* CTA */}
                    <button
                      className="w-full rounded-xl bg-[#6c63ff] py-3 text-[14px] font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80"
                      onClick={handleCopyInvite}
                      type="button"
                    >
                      Copy Invite Info
                    </button>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="pointer-events-none absolute inset-x-0 bottom-5 z-20 flex justify-center">
        <div className="pointer-events-auto flex items-center gap-3 rounded-[28px] border border-[#ececef] bg-white/96 px-5 py-3 shadow-[0_18px_50px_rgba(10,12,24,0.16)] backdrop-blur-xl">
          <DockControl
            danger={!mediaState.micEnabled}
            wide
            onClick={() => {
              void liveKitControlsRef.current?.toggleMicrophone();
            }}
            icon={
              <div className="flex items-center gap-1">
                {mediaState.micEnabled ? (
                  <Mic className="h-[18px] w-[18px] stroke-[2.2]" />
                ) : (
                  <MicOff className="h-[18px] w-[18px] stroke-[2.2]" />
                )}
                <ChevronDown className="h-[14px] w-[14px] stroke-[2.2]" />
              </div>
            }
          />
          <DockControl
            danger={!mediaState.cameraEnabled}
            wide
            onClick={() => {
              void liveKitControlsRef.current?.toggleCamera();
            }}
            icon={
              <div className="flex items-center gap-1">
                {mediaState.cameraEnabled ? (
                  <Video className="h-[18px] w-[18px] stroke-[2.2]" />
                ) : (
                  <VideoOff className="h-[18px] w-[18px] stroke-[2.2]" />
                )}
                <ChevronDown className="h-[14px] w-[14px] stroke-[2.2]" />
              </div>
            }
          />
          <DockControl icon={<MonitorUp className="h-[18px] w-[18px] stroke-[2.2]" />} />
          <DockControl icon={<Grid2x2 className="h-[18px] w-[18px] stroke-[2.2]" />} />
          <DockControl icon={<SmilePlus className="h-[18px] w-[18px] stroke-[2.2]" />} />
        </div>
      </div>

      <PhaserGame mapData={mapData} onPositionsChange={setPlayerPositions} roomId={roomId} />
    </div>
  );
}
