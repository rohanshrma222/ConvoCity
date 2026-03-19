"use client";
import dynamic from "next/dynamic";

const PhaserGame = dynamic(() => import("./PhaserGame"), { ssr: false });

interface GameCanvasProps {
  roomId: string;
}

export default function GameCanvas({ roomId }: GameCanvasProps) {
  return <PhaserGame roomId={roomId} />;
}
