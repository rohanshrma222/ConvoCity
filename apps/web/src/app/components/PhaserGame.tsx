"use client";

import { useEffect, useRef } from "react";
import Phaser from "phaser";
import { io, Socket } from "socket.io-client";
import type { MapRoom } from "./GameCanvas";

const TILE = 48;
const COLS = 20;
const ROWS = 17;
const DECOR_DEPTH = 3.5;

const COLOR = {
  floor:        0x4a4a6a,
  floorAlt:     0x424260,
  outerWall:    0x2a2a40,
  desk:         0x8b6914,
  deskTop:      0xc49a1e,
  meetingWall:  0x3a3a5a,
  meetingFloor: 0x3d3d5c,
};

const CHAR_FRAME_W = 48;
const CHAR_FRAME_H = 96;
const CHARACTER_COUNT = 4;

const DECOR_ASSETS = [
  "desk",
  "plant1",
  "plant2",
  "printer",
  "shelves",
  "sofachair",
  "splant1",
  "splant2",
  "storage",
  "vending",
  "water",
  "whiteboard",
  "chairs",
  "monitor",
  "coffemac",
  "chair1",
  "keyboardmouse",
] as const;

type DecorItem = {
  key: (typeof DECOR_ASSETS)[number];
  tileX: number;
  tileY: number;
  width: number;
  height: number;
  depth?: number;
  originX?: number;
  originY?: number;
};

type PlayerPosition = {
  userId: string;
  x: number;
  y: number;
};

const DECOR_LAYOUT: DecorItem[] = [
  { key: "desk", tileX: 1.1, tileY: 5.25, width: TILE * 4, height: TILE * 2.7 },
  { key: "desk", tileX: 15.1, tileY: 6.2, width: TILE * 4, height: TILE * 2.7 },
  { key: "whiteboard", tileX: 10.7, tileY: 1.5, width: TILE * 1.6, height: TILE * 1.2, depth: 2.8, originX: 0, originY: 1 },
  { key: "sofachair", tileX: 5.0, tileY: 8.2, width: TILE * 1.3, height: TILE * 1.4 },
  { key: "sofachair", tileX: 6.0, tileY: 8.2, width: TILE * 1.3, height: TILE * 1.4 },
  { key: "printer", tileX: 17.6, tileY: 4.6, width: TILE * 1.35, height: TILE * 1.05 },
  { key: "shelves", tileX: 15.2, tileY: 2.3, width: TILE * 2.4, height: TILE *2.0 },
  { key: "storage", tileX: 12.2, tileY: 2.5, width: TILE * 2.5, height: TILE * 2.7 },
  { key: "vending", tileX: 4.2, tileY: 12.4, width: TILE * 1.7, height: TILE * 2.6, depth: 2.7 },
  { key: "water", tileX: 9.2, tileY: 12.6, width: TILE * 2.05, height: TILE * 2.95, depth: 2.7 },
  { key: "plant1", tileX: 3.1, tileY: 1.55, width: TILE * 1.05, height: TILE * 1.95 },
  { key: "plant1", tileX: 4.3, tileY: 16.1, width: TILE * 1.05, height: TILE * 1.95 },
  { key: "plant1", tileX: 10.1, tileY: 16.1, width: TILE * 1.05, height: TILE * 1.95 },
  { key: "plant2", tileX: 17.6, tileY: 2.3, width: TILE * 1.61, height: TILE * 1.7 },
  { key: "splant1", tileX: 6.1, tileY: 12.5, width: TILE * 0.8, height: TILE * 0.8, depth: 3.1 },
  { key: "splant2", tileX: 11.1, tileY: 12.5, width: TILE * 0.9, height: TILE * 0.8, depth: 3.1 },
  { key: "chairs", tileX: 4.8, tileY: 2.5, width: TILE * 3.4, height: TILE * 2.5, depth: 2.7 },
  { key: "coffemac", tileX: 8.0, tileY: 2.5, width: TILE * 3.0, height: TILE * 2.5, depth: 3.1 },
  { key: "monitor", tileX: 16.1, tileY: 4.2, width: TILE * 1.6, height: TILE * 1.3, depth: 4.1 },
  { key: "chair1", tileX: 1.3, tileY: 2.8, width: TILE * 1.8, height: TILE * 1.8, depth: 2.7 },
  { key: "keyboardmouse", tileX: 16.2, tileY: 4.74, width: TILE * 1.62, height: TILE * 0.6, depth: 4.1 },
];

function safeSet(map: number[][], row: number, col: number, value: number) {
  if (row < 0 || row >= ROWS || col < 0 || col >= COLS) {
    return;
  }

  map[row]![col] = value;
}

function normalizeCharacterId(value?: string): number {
  const match = value?.match(/character-(\d+)/);
  const parsed = match ? Number.parseInt(match[1] ?? "1", 10) : 1;

  return Math.min(Math.max(parsed, 1), CHARACTER_COUNT) - 1;
}

function rowOffset(direction: "down" | "left" | "right" | "up") {
  if (direction === "left") return 12;
  if (direction === "right") return 24;
  if (direction === "up") return 36;
  return 0;
}

function idleFrame(characterIndex: number, direction: "down" | "left" | "right" | "up" = "down") {
  return rowOffset(direction) + characterIndex * 3 + 1;
}

function walkFrames(characterIndex: number, direction: "down" | "left" | "right" | "up") {
  const base = rowOffset(direction) + characterIndex * 3;
  return [base + 1, base, base + 1, base + 2];
}

function animationKey(characterIndex: number, direction: "down" | "left" | "right" | "up" | "idle") {
  return direction === "idle"
    ? `character-${characterIndex}-idle`
    : `character-${characterIndex}-walk-${direction}`;
}

type AvatarState = {
  id: string;
  userId: string;
  displayName: string;
  skinTone: string;
  outfitColor: string;
};

type SocketPlayer = {
  id: string;
  userId: string;
  x: number;
  y: number;
  name: string;
  roomId: string;
  characterId: string;
};

class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };
  private socket!: Socket;
  private otherPlayers: Record<string, Phaser.GameObjects.Sprite> = {};
  private wallGroup!: Phaser.Physics.Arcade.StaticGroup;
  private avatarLookup: Record<string, AvatarState> = {};
  private currentAvatar: AvatarState | null = null;

  constructor() {
    super({ key: "GameScene" });
  }

  private buildMapFromTemplate(rooms: MapRoom[]): number[][] {
    const map: number[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(0));

    for (let col = 0; col < COLS; col++) {
      map[0]![col] = 1;
      map[ROWS - 1]![col] = 1;
    }

    for (let row = 0; row < ROWS; row++) {
      map[row]![0] = 1;
      map[row]![COLS - 1] = 1;
    }

    rooms.forEach((room) => {
      if (room.type === "MEETING") {
        for (let i = 0; i < 8; i++) {
          safeSet(map, room.posY, room.posX + i, 3);
        }

        for (let i = 1; i < 5; i++) {
          safeSet(map, room.posY + i, room.posX, 3);
          safeSet(map, room.posY + i, room.posX + 7, 3);
        }

        safeSet(map, room.posY + 5, room.posX, 3);
        safeSet(map, room.posY + 5, room.posX + 1, 3);
        safeSet(map, room.posY + 5, room.posX + 2, 3);
        safeSet(map, room.posY + 5, room.posX + 5, 3);
        safeSet(map, room.posY + 5, room.posX + 6, 3);
        safeSet(map, room.posY + 5, room.posX + 7, 3);
      }

      if (room.type === "OFFICE") {
        safeSet(map, room.posY, room.posX, 2);
        safeSet(map, room.posY, room.posX + 1, 2);
        safeSet(map, room.posY + 1, room.posX, 2);
        safeSet(map, room.posY + 1, room.posX + 1, 2);
      }
    });

    return map;
  }

  private isMeetingFloorTile(rooms: MapRoom[], row: number, col: number): boolean {
    return rooms.some(
      (room) =>
        room.type === "MEETING" &&
        row >= room.posY + 1 &&
        row <= room.posY + 4 &&
        col >= room.posX + 1 &&
        col <= room.posX + 6,
    );
  }

  private addRoomLabels(rooms: MapRoom[]) {
    rooms.forEach((room) => {
      const offsetX = room.type === "MEETING" ? 4 : 1.6;
      const offsetY = room.type === "MEETING" ? 2.8 : 0.9;

      this.add
        .text((room.posX + offsetX) * TILE, (room.posY + offsetY) * TILE, room.name, {
          fontSize: "11px",
          color: "#aaaacc",
          fontFamily: "monospace",
        })
        .setOrigin(0.5)
        .setDepth(3);
    });
  }

  private emitPositions() {
    const emit = this.game.registry.get("emitPositions") as
      | ((players: PlayerPosition[]) => void)
      | undefined;
    const currentUserId = this.game.registry.get("currentUserId") as string | undefined;

    if (!emit || !currentUserId || !this.player) {
      return;
    }

    const positions: PlayerPosition[] = [
      {
        userId: currentUserId,
        x: this.player.x,
        y: this.player.y,
      },
      ...Object.values(this.otherPlayers)
        .map((sprite) => {
          const userId = sprite.getData("userId") as string | undefined;
          if (!userId) return null;

          return {
            userId,
            x: sprite.x,
            y: sprite.y,
          };
        })
        .filter((player): player is PlayerPosition => player !== null),
    ];

    emit(positions);
  }

  preload() {
    this.load.spritesheet("character", "/assets/Characters.png", {
      frameWidth: CHAR_FRAME_W,
      frameHeight: CHAR_FRAME_H,
    });
    this.load.image("floor", "/assets/tile.png");
    DECOR_ASSETS.forEach((asset) => {
      this.load.image(asset, `/assets/${asset}.png`);
    });
  }

  create() {
    const roomId = this.game.registry.get("roomId") as string;
    const rooms = (this.game.registry.get("mapRooms") as MapRoom[]) ?? [];
    const avatars = (this.game.registry.get("avatars") as AvatarState[]) ?? [];
    const currentUserId = this.game.registry.get("currentUserId") as string;
    const map = this.buildMapFromTemplate(rooms);
    const mapW = COLS * TILE;
    const mapH = ROWS * TILE;

    this.avatarLookup = Object.fromEntries(avatars.map((avatar) => [avatar.userId, avatar]));
    this.currentAvatar = avatars.find((avatar) => avatar.userId === currentUserId) ?? null;

    this.wallGroup = this.physics.add.staticGroup();

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const x = col * TILE;
        const y = row * TILE;
        const tile = map[row]![col]!;
        const isAlt = (row + col) % 2 === 0;

        this.add.image(x, y, "floor").setOrigin(0).setDepth(0).setDisplaySize(TILE, TILE).setAlpha(isAlt ? 1 : 0.85);

        if (this.isMeetingFloorTile(rooms, row, col)) {
          this.add.rectangle(x, y, TILE, TILE, COLOR.meetingFloor).setOrigin(0).setDepth(0.5);
        }

        if (tile === 1) {
          this.add.rectangle(x, y, TILE, TILE, COLOR.outerWall).setOrigin(0).setDepth(1);
          this.add.rectangle(x, y, TILE, 4, 0x5a5a7a).setOrigin(0).setDepth(2);
          this.addWall(x, y);
        }

        if (tile === 2) {
          this.addWall(x, y);
        }

        if (tile === 3) {
          this.add.rectangle(x, y, TILE, TILE, COLOR.meetingWall).setOrigin(0).setDepth(1);
          this.add.rectangle(x, y, TILE, 3, 0x6a6a9a).setOrigin(0).setDepth(2);
          this.addWall(x, y);
        }
      }
    }

    this.addDecor();
    this.addRoomLabels(rooms);

    for (let characterIndex = 0; characterIndex < CHARACTER_COUNT; characterIndex += 1) {
      this.anims.create({
        key: animationKey(characterIndex, "down"),
        frames: this.anims.generateFrameNumbers("character", {
          frames: walkFrames(characterIndex, "down"),
        }),
        frameRate: 8,
        repeat: -1,
      });
      this.anims.create({
        key: animationKey(characterIndex, "left"),
        frames: this.anims.generateFrameNumbers("character", {
          frames: walkFrames(characterIndex, "left"),
        }),
        frameRate: 8,
        repeat: -1,
      });
      this.anims.create({
        key: animationKey(characterIndex, "right"),
        frames: this.anims.generateFrameNumbers("character", {
          frames: walkFrames(characterIndex, "right"),
        }),
        frameRate: 8,
        repeat: -1,
      });
      this.anims.create({
        key: animationKey(characterIndex, "up"),
        frames: this.anims.generateFrameNumbers("character", {
          frames: walkFrames(characterIndex, "up"),
        }),
        frameRate: 8,
        repeat: -1,
      });
      this.anims.create({
        key: animationKey(characterIndex, "idle"),
        frames: [{ key: "character", frame: idleFrame(characterIndex) }],
        frameRate: 1,
        repeat: 0,
      });
    }

    this.player = this.physics.add.sprite(9 * TILE, 5 * TILE, "character");
    this.player.setCollideWorldBounds(true);
    this.player.setDepth(2.8);
    this.player.setScale(1.2);
    this.player.play(animationKey(normalizeCharacterId(this.currentAvatar?.skinTone), "idle"));
    this.player.setSize(24, 40);
    this.player.setOffset(12, 12);

    this.physics.add.collider(this.player, this.wallGroup);

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = {
      up: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };

    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, mapW, mapH);
    this.cameras.main.setZoom(1.4);
    this.physics.world.setBounds(0, 0, mapW, mapH);

    this.socket = io("http://localhost:3001");

    this.socket.emit("player:join", {
      userId: currentUserId,
      name: this.currentAvatar?.displayName ?? "Player",
      x: this.player.x,
      y: this.player.y,
      roomId,
      characterId: this.currentAvatar?.skinTone ?? "character-1",
    });

    this.socket.on("players:init", (players: SocketPlayer[]) => {
      players.forEach((player) => {
        if (player.id !== this.socket.id) {
          this.addOtherPlayer(player);
        }
      });
      this.emitPositions();
    });

    this.socket.on("player:joined", (player: SocketPlayer) => {
      this.addOtherPlayer(player);
      this.emitPositions();
    });

    this.socket.on("player:moved", ({ id, x, y, anim, characterId }: { id: string; x: number; y: number; anim: string; characterId?: string }) => {
      const other = this.otherPlayers[id];

      if (other) {
        other.setPosition(x, y);
        const characterIndex = normalizeCharacterId(characterId);
        const direction =
          anim === "idle" ? "idle" : (anim.replace("walk-", "") as "down" | "left" | "right" | "up");
        other.play(animationKey(characterIndex, direction), true);
        this.emitPositions();
      }
    });

    this.socket.on("player:left", (id: string) => {
      this.otherPlayers[id]?.destroy();
      delete this.otherPlayers[id];
      this.emitPositions();
    });

    this.emitPositions();
  }

  private addDecor() {
    DECOR_LAYOUT.forEach((item) => {
      this.add
        .image(item.tileX * TILE, item.tileY * TILE, item.key)
        .setOrigin(item.originX ?? 0, item.originY ?? 1)
        .setDepth(item.depth ?? DECOR_DEPTH)
        .setDisplaySize(item.width, item.height);
    });
  }

  private addWall(x: number, y: number) {
    const wall = this.add.rectangle(x + TILE / 2, y + TILE / 2, TILE, TILE, 0x000000, 0);
    this.physics.add.existing(wall, true);
    this.wallGroup.add(wall);
  }

  addOtherPlayer(player: SocketPlayer) {
    const sprite = this.add.sprite(player.x, player.y, "character").setDepth(5).setScale(1.2);
    sprite.setData("userId", player.userId);
    sprite.play(animationKey(normalizeCharacterId(player.characterId), "idle"));
    this.otherPlayers[player.id] = sprite;
  }

  update() {
    const speed = 180;
    this.player.setVelocity(0);

    const left = this.cursors.left.isDown || this.wasd.left.isDown;
    const right = this.cursors.right.isDown || this.wasd.right.isDown;
    const up = this.cursors.up.isDown || this.wasd.up.isDown;
    const down = this.cursors.down.isDown || this.wasd.down.isDown;

    const characterId = this.currentAvatar?.skinTone ?? "character-1";
    const characterIndex = normalizeCharacterId(characterId);
    let moving = false;
    let currentAnim = animationKey(characterIndex, "idle");

    if (left) {
      this.player.setVelocityX(-speed);
      this.player.play(animationKey(characterIndex, "left"), true);
      currentAnim = animationKey(characterIndex, "left");
      moving = true;
    } else if (right) {
      this.player.setVelocityX(speed);
      this.player.play(animationKey(characterIndex, "right"), true);
      currentAnim = animationKey(characterIndex, "right");
      moving = true;
    }

    if (up) {
      this.player.setVelocityY(-speed);
      this.player.play(animationKey(characterIndex, "up"), true);
      currentAnim = animationKey(characterIndex, "up");
      moving = true;
    } else if (down) {
      this.player.setVelocityY(speed);
      this.player.play(animationKey(characterIndex, "down"), true);
      currentAnim = animationKey(characterIndex, "down");
      moving = true;
    }

    if ((left || right) && (up || down)) {
      this.player.body!.velocity.normalize().scale(speed);
    }

    if (!moving) {
      this.player.play(animationKey(characterIndex, "idle"), true);
      currentAnim = animationKey(characterIndex, "idle");
    }

    this.socket?.emit("player:move", {
      x: this.player.x,
      y: this.player.y,
      anim: currentAnim,
      characterId,
    });

    this.emitPositions();
  }

  shutdown() {
    this.socket?.disconnect();
  }
}

interface PhaserGameProps {
  roomId: string;
  mapData: {
    rooms: MapRoom[];
    avatars: AvatarState[];
    currentUserId: string;
  };
  onPositionsChange?: (players: PlayerPosition[]) => void;
}

export default function PhaserGame({ roomId, mapData, onPositionsChange }: PhaserGameProps) {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    gameRef.current?.destroy(true);
    gameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: "#1a1a2e",
      physics: {
        default: "arcade",
        arcade: { gravity: { x: 0, y: 0 }, debug: false },
      },
      scene: [GameScene],
      parent: "game-container",
      callbacks: {
        preBoot: (game) => {
          game.registry.set("roomId", roomId);
          game.registry.set("mapRooms", mapData.rooms);
          game.registry.set("avatars", mapData.avatars);
          game.registry.set("currentUserId", mapData.currentUserId);
          game.registry.set("emitPositions", onPositionsChange);
        },
      },
    });

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [mapData, onPositionsChange, roomId]);

  return <div id="game-container" className="h-screen w-full" />;
}
