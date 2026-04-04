// apps/server/src/index.ts
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] }
});

interface Player {
  id: string;
  userId: string;
  x: number;
  y: number;
  name: string;
  roomId: string;
  characterId: string;
}

interface RoomState {
  id: string;
  players: Record<string, Player>;
}

const rooms: Record<string, RoomState> = {};

const getOrCreateRoom = (roomId: string): RoomState => {
  if (!rooms[roomId]) {
    rooms[roomId] = {
      id: roomId,
      players: {},
    };
  }

  return rooms[roomId];
};

const removePlayerFromRoom = (playerId: string, roomId?: string) => {
  if (!roomId) return;

  const room = rooms[roomId];
  if (!room) return;

  delete room.players[playerId];

  if (Object.keys(room.players).length === 0) {
    delete rooms[roomId];
  }
};

io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);

  socket.on("player:join", (data: { userId: string; name: string; x: number; y: number; roomId: string; characterId: string }) => {
    const roomId = data.roomId.trim();
    if (!roomId) return;

    const previousRoomId = socket.data.roomId as string | undefined;
    if (previousRoomId && previousRoomId !== roomId) {
      socket.leave(previousRoomId);
      removePlayerFromRoom(socket.id, previousRoomId);
      socket.to(previousRoomId).emit("player:left", socket.id);
    }

    const room = getOrCreateRoom(roomId);
    const player: Player = {
      id: socket.id,
      userId: data.userId,
      x: data.x,
      y: data.y,
      name: data.name,
      roomId,
      characterId: data.characterId,
    };

    room.players[socket.id] = player;
    socket.data.roomId = roomId;
    socket.join(roomId);

    socket.emit("players:init", Object.values(room.players));
    socket.to(roomId).emit("player:joined", player);
  });

  socket.on("player:move", (data: { x: number; y: number; anim: string; characterId?: string }) => {
    const roomId = socket.data.roomId as string | undefined;
    if (!roomId) return;

    const room = rooms[roomId];
    const player = room?.players[socket.id];
    if (!player) return;

    player.x = data.x;
    player.y = data.y;
    if (data.characterId) {
      player.characterId = data.characterId;
    }

    socket.to(roomId).emit("player:moved", { id: socket.id, ...data });
  });

  socket.on("disconnect", () => {
    const roomId = socket.data.roomId as string | undefined;

    removePlayerFromRoom(socket.id, roomId);

    if (roomId) {
      socket.to(roomId).emit("player:left", socket.id);
    }
  });
});

httpServer.listen(3001, () => console.log("Socket server on port 3001"));
