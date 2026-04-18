"use client";

import { useEffect, useRef } from "react";
import Phaser from "phaser";
import { io, Socket } from "socket.io-client";
import type {
  JoinPlayerPayload,
  MovePlayerPayload,
  PlayerPosition,
  PlayerMovedEvent,
  SocketClientToServerEvents,
  SocketPlayer,
  SocketServerToClientEvents,
} from "@repo/types";
import type { MapRoom } from "./GameCanvas";

const TILE = 48;
const DECOR_DEPTH = 3.5;
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:3001";
const DEBUG_POSITION_SYNC = false;
const EMIT_INTERVAL = 66;
const POSITION_THRESHOLD = 1;

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

type TemplateZone = {
  id: string;
  name: string;
  type: "private";
  x: number;
  y: number;
  width: number;
  height: number;
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
  zones?: TemplateZone[];
  objects: DecorItem[];
  roomLabels?: TemplateRoomLabel[];
  colors: TemplateColors;
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
  private socket!: Socket<SocketServerToClientEvents, SocketClientToServerEvents>;
  private otherPlayers: Record<string, Phaser.GameObjects.Sprite> = {};
  private wallGroup!: Phaser.Physics.Arcade.StaticGroup;
  private avatarLookup: Record<string, AvatarState> = {};
  private currentAvatar: AvatarState | null = null;
  private lastDirection: "down" | "left" | "right" | "up" = "down";
  private hasLeftRoom = false;
  private tileSize = TILE;
  private zones: TemplateZone[] = [];
  private mapWidth = 0;
  private mapHeight = 0;
  private activeZoneId: string | null = null;
  private zoneDimmers: Phaser.GameObjects.Rectangle[] = [];
  private lastEmitTime = 0;
  private lastEmittedX = 0;
  private lastEmittedY = 0;
  private lastEmittedAnim = `idle-${this.lastDirection}`;
  private lastEmittedZoneId: string | null = null;
  private wasMoving = false;
  private lastPositionEmitTime = 0;

  constructor() {
    super({ key: "GameScene" });
  }

  private getZoneIdForPosition(
    x: number,
    y: number,
    tileSize: number,
    zones: TemplateZone[],
  ): string | null {
    const tileX = x / tileSize;
    const tileY = y / tileSize;

    const zone = zones.find(
      (item) =>
        tileX >= item.x &&
        tileX < item.x + item.width &&
        tileY >= item.y &&
        tileY < item.y + item.height,
    );

    return zone?.id ?? null;
  }

  private createZoneDimmers() {
    this.zoneDimmers = Array.from({ length: 4 }, () =>
      this.add
        .rectangle(0, 0, 0, 0, 0x000000, 0.36)
        .setOrigin(0)
        .setDepth(4.7)
        .setAlpha(0)
        .setVisible(false),
    );
  }

  private fadeZoneDimmersIn() {
    this.zoneDimmers.forEach((dimmer) => {
      this.tweens.killTweensOf(dimmer);

      if (!dimmer.visible) {
        dimmer.setAlpha(0).setVisible(true);
      }

      this.tweens.add({
        targets: dimmer,
        alpha: 1,
        duration: 240,
        ease: "Quad.easeOut",
      });
    });
  }

  private fadeZoneDimmersOut() {
    this.zoneDimmers.forEach((dimmer) => {
      this.tweens.killTweensOf(dimmer);

      if (!dimmer.visible && dimmer.alpha === 0) {
        return;
      }

      this.tweens.add({
        targets: dimmer,
        alpha: 0,
        duration: 180,
        ease: "Quad.easeOut",
        onComplete: () => {
          dimmer.setVisible(false);
        },
      });
    });
  }

  private updateZoneFocus(zoneId: string | null) {
    if (this.activeZoneId === zoneId) {
      return;
    }

    this.activeZoneId = zoneId;

    if (!zoneId) {
      this.fadeZoneDimmersOut();
      return;
    }

    const zone = this.zones.find((item) => item.id === zoneId);

    if (!zone) {
      this.fadeZoneDimmersOut();
      this.activeZoneId = null;
      return;
    }

    const zoneX = zone.x * this.tileSize;
    const zoneY = zone.y * this.tileSize;
    const zoneWidth = zone.width * this.tileSize;
    const zoneHeight = zone.height * this.tileSize;
    const [top, left, right, bottom] = this.zoneDimmers;

    if (!top || !left || !right || !bottom) {
      return;
    }

    top.setPosition(0, 0).setSize(this.mapWidth, zoneY).setVisible(zoneY > 0);
    left.setPosition(0, zoneY).setSize(zoneX, zoneHeight).setVisible(zoneX > 0);
    right
      .setPosition(zoneX + zoneWidth, zoneY)
      .setSize(this.mapWidth - (zoneX + zoneWidth), zoneHeight)
      .setVisible(zoneX + zoneWidth < this.mapWidth);
    bottom
      .setPosition(0, zoneY + zoneHeight)
      .setSize(this.mapWidth, this.mapHeight - (zoneY + zoneHeight))
      .setVisible(zoneY + zoneHeight < this.mapHeight);

    this.fadeZoneDimmersIn();
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
        zoneId: this.getZoneIdForPosition(this.player.x, this.player.y, this.tileSize, this.zones),
      },
      ...Object.values(this.otherPlayers)
        .map((sprite) => {
          const userId = sprite.getData("userId") as string | undefined;
          const zoneId = sprite.getData("zoneId") as string | null | undefined;
          if (!userId) return null;

          return {
            userId,
            x: sprite.x,
            y: sprite.y,
            zoneId: zoneId ?? null,
          };
        })
        .filter((player): player is PlayerPosition => player !== null),
    ];

    if (DEBUG_POSITION_SYNC) {
      console.log("[position-sync] emit", {
        currentUserId,
        positions,
      });
    }

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
    this.tileSize = tileSize;
    const map = template.tileGrid;
    const zones = template.zones ?? [];
    this.zones = zones;
    const mapRows = template.rows || map.length;
    const mapCols = template.cols || map[0]?.length || 0;
    const mapW = mapCols * tileSize;
    const mapH = mapRows * tileSize;
    this.mapWidth = mapW;
    this.mapHeight = mapH;
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
    this.createZoneDimmers();

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

    const currentZoneId = this.getZoneIdForPosition(
      this.player.x,
      this.player.y,
      tileSize,
      zones,
    );
    this.updateZoneFocus(currentZoneId);

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

    this.socket = io(SOCKET_URL);

    const joinPayload: JoinPlayerPayload = {
      userId: currentUserId,
      name: this.currentAvatar?.displayName ?? "Player",
      x: this.player.x,
      y: this.player.y,
      roomId,
      characterId: this.currentAvatar?.skinTone ?? "character-1",
      zoneId: currentZoneId,
    };

    this.socket.emit("player:join", joinPayload);
    this.lastEmittedX = this.player.x;
    this.lastEmittedY = this.player.y;
    this.lastEmittedAnim = `idle-${this.lastDirection}`;
    this.lastEmittedZoneId = currentZoneId;
    this.lastEmitTime = performance.now();

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

    this.socket.on("player:moved", ({ id, x, y, anim, characterId, zoneId }: PlayerMovedEvent) => {
      const other = this.otherPlayers[id];
      if (!other) return;

      other.setData("zoneId", zoneId);

      this.tweens.killTweensOf(other);
      this.tweens.add({
        targets: other,
        x,
        y,
        duration: 80,
        ease: "Linear",
      });

      const characterIndex = normalizeCharacterId(characterId);
      const [state, directionRaw] = anim.split("-");
      const direction = (directionRaw as "down" | "left" | "right" | "up") || "down";
      other.play(animationKey(characterIndex, direction, state === "idle" ? "idle" : "walk"), true);

      this.emitPositions();
    });

    this.socket.on("player:left", (id: string) => {
      this.otherPlayers[id]?.destroy();
      delete this.otherPlayers[id];
      this.emitPositions();
    });

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.cleanupSocket();
    });

    this.events.once(Phaser.Scenes.Events.DESTROY, () => {
      this.cleanupSocket();
    });

    if (performance.now() - this.lastPositionEmitTime >= 100) {
      this.emitPositions();
      this.lastPositionEmitTime = performance.now();
    }
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
    sprite.setData("zoneId", player.zoneId);
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

    const currentZoneId = this.getZoneIdForPosition(
      this.player.x,
      this.player.y,
      this.tileSize,
      this.zones,
    );
    this.updateZoneFocus(currentZoneId);

    const movePayload: MovePlayerPayload = {
      x: this.player.x,
      y: this.player.y,
      anim: currentAnim,
      characterId,
      zoneId: currentZoneId,
    };

    const now = performance.now();
    const dx = Math.abs(this.player.x - this.lastEmittedX);
    const dy = Math.abs(this.player.y - this.lastEmittedY);
    const positionChanged = dx > POSITION_THRESHOLD || dy > POSITION_THRESHOLD;
    const animChanged = currentAnim !== this.lastEmittedAnim;
    const zoneChanged = currentZoneId !== this.lastEmittedZoneId;
    const somethingChanged = positionChanged || animChanged || zoneChanged;

    const sendMove = () => {
      this.socket?.emit("player:move", movePayload);
      this.lastEmitTime = now;
      this.lastEmittedX = this.player.x;
      this.lastEmittedY = this.player.y;
      this.lastEmittedAnim = currentAnim;
      this.lastEmittedZoneId = currentZoneId;
    };

    if (moving && somethingChanged && now - this.lastEmitTime >= EMIT_INTERVAL) {
      sendMove();
      this.wasMoving = true;
    }

    if (!moving && this.wasMoving) {
      sendMove();
      this.wasMoving = false;
    }

    this.emitPositions();
  }

  shutdown() {
    this.cleanupSocket();
  }

  private cleanupSocket() {
    if (!this.socket) {
      return;
    }

    if (!this.hasLeftRoom) {
      this.socket.emit("player:leave");
      this.hasLeftRoom = true;
    }

    this.socket.removeAllListeners();
    this.socket.disconnect();
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
