"use client";

import { useEffect, useRef } from "react";
import Phaser from "phaser";
import { io, Socket } from "socket.io-client";
import type { MapRoom } from "./GameCanvas";

const TILE = 48;
const DECOR_DEPTH = 3.5;

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
  "back-chair",
  "desk1",
  "AC",
  "conf-table",
  "private-chair",
  "private-chair-R"
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

function animationKey(
  characterIndex: number,
  direction: "down" | "left" | "right" | "up",
  state: "idle" | "walk" = "walk",
) {
  return state === "idle"
    ? `character-${characterIndex}-idle-${direction}`
    : `character-${characterIndex}-walk-${direction}`;
}

type AvatarState = {
  id: string;
  userId: string;
  displayName: string;
  skinTone: string;
  outfitColor: string;
};

type TemplateMeetingRoom = {
  posX: number;
  posY: number;
  name: string;
};

type TemplateRoomLabel = {
  text: string;
  tileX: number;
  tileY: number;
};

type TemplateColors = {
  floor: string;
  floorAlt: string;
  outerWall: string;
  meetingWall: string;
  meetingFloor: string;
};

type TemplateData = {
  id: string;
  name: string;
  cols: number;
  rows: number;
  spawnX: number;
  spawnY: number;
  tileSize: number;
  tileGrid: number[][];
  meetingRooms: TemplateMeetingRoom[];
  objects: DecorItem[];
  roomLabels?: TemplateRoomLabel[];
  colors: TemplateColors;
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
  private lastDirection: "down" | "left" | "right" | "up" = "down";

  constructor() {
    super({ key: "GameScene" });
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
    const templateId = (this.game.registry.get("templateId") as string | undefined) ?? "modern-office";

    this.load.json("template", `/assets/templates/${templateId}.json`);
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
    const avatars = (this.game.registry.get("avatars") as AvatarState[]) ?? [];
    const currentUserId = this.game.registry.get("currentUserId") as string;
    const template = this.cache.json.get("template") as TemplateData | undefined;

    if (!template) {
      throw new Error("Template JSON failed to load");
    }

    const tileSize = template.tileSize || TILE;
    const map = template.tileGrid;
    const mapRows = template.rows || map.length;
    const mapCols = template.cols || map[0]?.length || 0;
    const mapW = mapCols * tileSize;
    const mapH = mapRows * tileSize;
    const colors = {
      floor: parseColor(template.colors.floor),
      floorAlt: parseColor(template.colors.floorAlt),
      outerWall: parseColor(template.colors.outerWall),
      meetingWall: parseColor(template.colors.meetingWall),
      meetingFloor: parseColor(template.colors.meetingFloor),
    };
    const meetingRects = template.meetingRooms.map((room) => ({
      x1: room.posX + 1,
      y1: room.posY + 1,
      x2: room.posX + 6,
      y2: room.posY + 4,
    }));

    this.avatarLookup = Object.fromEntries(avatars.map((avatar) => [avatar.userId, avatar]));
    this.currentAvatar = avatars.find((avatar) => avatar.userId === currentUserId) ?? null;

    this.wallGroup = this.physics.add.staticGroup();

    for (let row = 0; row < mapRows; row++) {
      for (let col = 0; col < mapCols; col++) {
        const x = col * tileSize;
        const y = row * tileSize;
        const tile = map[row]![col]!;
        const isAlt = (row + col) % 2 === 0;
        const isMeetingFloor = meetingRects.some(
          (rect) => row >= rect.y1 && row <= rect.y2 && col >= rect.x1 && col <= rect.x2,
        );

        this.add.image(x, y, "floor").setOrigin(0).setDepth(0).setDisplaySize(tileSize, tileSize).setAlpha(isAlt ? 1 : 0.85);

        if (isMeetingFloor) {
          this.add.rectangle(x, y, tileSize, tileSize, colors.meetingFloor).setOrigin(0).setDepth(0.5);
        }

        if (tile === 1) {
          this.add.rectangle(x, y, tileSize, tileSize, colors.outerWall).setOrigin(0).setDepth(1);
          this.add.rectangle(x, y, tileSize, 4, 0x5a5a7a).setOrigin(0).setDepth(2);
          this.addWall(x, y, tileSize);
        }

        if (tile === 2) {
          this.addWall(x, y, tileSize);
        }

        if (tile === 3) {
          this.add.rectangle(x, y, tileSize, tileSize, colors.meetingWall).setOrigin(0).setDepth(1);
          this.add.rectangle(x, y, tileSize, 3, 0x6a6a9a).setOrigin(0).setDepth(2);
          this.addWall(x, y, tileSize);
        }
      }
    }

    this.addDecor(template, tileSize);
    this.addRoomLabels(template, tileSize);

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
        key: animationKey(characterIndex, "down", "idle"),
        frames: [{ key: "character", frame: idleFrame(characterIndex, "down") }],
        frameRate: 1,
        repeat: 0,
      });
      this.anims.create({
        key: animationKey(characterIndex, "left", "idle"),
        frames: [{ key: "character", frame: idleFrame(characterIndex, "left") }],
        frameRate: 1,
        repeat: 0,
      });
      this.anims.create({
        key: animationKey(characterIndex, "right", "idle"),
        frames: [{ key: "character", frame: idleFrame(characterIndex, "right") }],
        frameRate: 1,
        repeat: 0,
      });
      this.anims.create({
        key: animationKey(characterIndex, "up", "idle"),
        frames: [{ key: "character", frame: idleFrame(characterIndex, "up") }],
        frameRate: 1,
        repeat: 0,
      });
    }

    this.player = this.physics.add.sprite(template.spawnX * tileSize, template.spawnY * tileSize, "character");
    this.player.setCollideWorldBounds(true);
    this.player.setDepth(4.8);
    this.player.setScale(0.9);
    this.player.play(animationKey(normalizeCharacterId(this.currentAvatar?.skinTone), this.lastDirection, "idle"));
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
        const [state, directionRaw] = anim.split("-");
        const direction = (directionRaw as "down" | "left" | "right" | "up") || "down";
        other.play(animationKey(characterIndex, direction, state === "idle" ? "idle" : "walk"), true);
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

  private addDecor(template: TemplateData, tileSize: number) {
    template.objects.forEach((item) => {
      this.add
        .image(item.tileX * tileSize, item.tileY * tileSize, item.key)
        .setOrigin(item.originX ?? 0, item.originY ?? 1)
        .setDepth(item.depth ?? DECOR_DEPTH)
        .setDisplaySize(item.width, item.height);
    });
  }

  private addRoomLabels(template: TemplateData, tileSize: number) {
    const labels =
      template.roomLabels && template.roomLabels.length > 0
        ? template.roomLabels
        : template.meetingRooms.map((room) => ({
            text: room.name,
            tileX: room.posX + 4,
            tileY: room.posY + 2.8,
          }));

    labels.forEach((label) => {
      this.add
        .text(label.tileX * tileSize, label.tileY * tileSize, label.text, {
          fontSize: "11px",
          color: "#d1d1d6ff",
          fontFamily: "monospace",
        })
        .setOrigin(0.5)
        .setDepth(3);
    });
  }

  private addWall(x: number, y: number, tileSize: number) {
    const wall = this.add.rectangle(x + tileSize / 2, y + tileSize / 2, tileSize, tileSize, 0x000000, 0);
    this.physics.add.existing(wall, true);
    this.wallGroup.add(wall);
  }

  addOtherPlayer(player: SocketPlayer) {
    const sprite = this.add.sprite(player.x, player.y, "character").setDepth(4.5).setScale(0.9);
    sprite.setData("userId", player.userId);
    sprite.play(animationKey(normalizeCharacterId(player.characterId), "down", "idle"));
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
    let currentAnim = `idle-${this.lastDirection}`;

    if (left) {
      this.player.setVelocityX(-speed);
      this.player.play(animationKey(characterIndex, "left"), true);
      this.lastDirection = "left";
      currentAnim = "walk-left";
      moving = true;
    } else if (right) {
      this.player.setVelocityX(speed);
      this.player.play(animationKey(characterIndex, "right"), true);
      this.lastDirection = "right";
      currentAnim = "walk-right";
      moving = true;
    }

    if (up) {
      this.player.setVelocityY(-speed);
      this.player.play(animationKey(characterIndex, "up"), true);
      this.lastDirection = "up";
      currentAnim = "walk-up";
      moving = true;
    } else if (down) {
      this.player.setVelocityY(speed);
      this.player.play(animationKey(characterIndex, "down"), true);
      this.lastDirection = "down";
      currentAnim = "walk-down";
      moving = true;
    }

    if ((left || right) && (up || down)) {
      this.player.body!.velocity.normalize().scale(speed);
    }

    if (!moving) {
      this.player.play(animationKey(characterIndex, this.lastDirection, "idle"), true);
      currentAnim = `idle-${this.lastDirection}`;
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
          game.registry.set("templateId", "modern-office");
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

function parseColor(value: string) {
  return Number.parseInt(value.replace(/^0x/i, ""), 16);
}
