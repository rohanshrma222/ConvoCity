export interface Player {
  id: string;
  name: string;
  x: number;
  y: number;
  roomId: string;
  avatar: string;
}

export interface Room {
  id: string;
  name: string;
  mapId: string;
  players: Record<string, Player>;
}

export type SocketEvents = {
  "player:join": (player: Player) => void;
  "player:move": (data: { id: string; x: number; y: number }) => void;
  "player:leave": (id: string) => void;
}