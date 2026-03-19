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
  x: number;
  y: number;
  name: string;
}

const players: Record<string, Player> = {};

io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);

  // new player joins
  socket.on("player:join", (data: { name: string; x: number; y: number }) => {
    players[socket.id] = { id: socket.id, ...data };
    // send existing players to new player
    socket.emit("players:init", Object.values(players));
    // tell everyone else about new player
    socket.broadcast.emit("player:joined", players[socket.id]);
  });

  // player moves
  socket.on("player:move", (data: { x: number; y: number }) => {
    const player = players[socket.id];
    if (!player) return;

    player.x = data.x;
    player.y = data.y;
    socket.broadcast.emit("player:moved", { id: socket.id, ...data });
  });

  // player leaves
  socket.on("disconnect", () => {
    delete players[socket.id];
    io.emit("player:left", socket.id);
  });
});

httpServer.listen(3001, () => console.log("Socket server on port 3001"));