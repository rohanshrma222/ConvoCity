export interface SocketPlayer {
  id: string;
  userId: string;
  x: number;
  y: number;
  name: string;
  roomId: string;
  characterId: string;
}

export interface RoomState {
  id: string;
  players: Record<string, SocketPlayer>;
}

export interface JoinPlayerPayload {
  userId: string;
  name: string;
  x: number;
  y: number;
  roomId: string;
  characterId: string;
}

export interface MovePlayerPayload {
  x: number;
  y: number;
  anim: string;
  characterId?: string;
}

export interface PlayerMovedEvent extends MovePlayerPayload {
  id: string;
}

export interface SocketServerToClientEvents {
  "players:init": (players: SocketPlayer[]) => void;
  "player:joined": (player: SocketPlayer) => void;
  "player:moved": (data: PlayerMovedEvent) => void;
  "player:left": (id: string) => void;
}

export interface SocketClientToServerEvents {
  "player:join": (data: JoinPlayerPayload) => void;
  "player:move": (data: MovePlayerPayload) => void;
  "player:leave": () => void;
}
