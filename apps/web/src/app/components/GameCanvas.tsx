"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { apiFetch } from "@/lib/api";

const PhaserGame = dynamic(() => import("./PhaserGame"), { ssr: false });

export type MapRoom = {
  name: string;
  type: "OFFICE" | "MEETING" | "OPEN" | "LOUNGE";
  posX: number;
  posY: number;
};

type SpaceResponse = {
  rooms?: MapRoom[];
  template?: {
    rooms?: MapRoom[];
  };
};

interface GameCanvasProps {
  roomId: string;
}

export default function GameCanvas({ roomId }: GameCanvasProps) {
  const [mapData, setMapData] = useState<{ rooms: MapRoom[] } | null>(null);

  useEffect(() => {
    let active = true;

    async function loadMap() {
      try {
        const response = await apiFetch<SpaceResponse>(`/space/${roomId}`);
        const rooms = response.data.rooms ?? response.data.template?.rooms ?? [];

        if (active) {
          setMapData({ rooms });
        }
      } catch {
        if (active) {
          setMapData({ rooms: [] });
        }
      }
    }

    loadMap();

    return () => {
      active = false;
    };
  }, [roomId]);

  if (!mapData) {
    return (
      <div className="grid h-screen w-full place-items-center bg-[#1a1a2e] text-sm text-[#8b92b8]">
        Loading space...
      </div>
    );
  }

  return <PhaserGame mapData={mapData} roomId={roomId} />;
}
