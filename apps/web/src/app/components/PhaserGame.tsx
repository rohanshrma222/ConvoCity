"use client";
import { useEffect, useRef } from "react";
import Phaser from "phaser";
import { io, Socket } from "socket.io-client";

// ─── Map Layout ───────────────────────────────────────────────
// 0 = floor  1 = outer wall  2 = desk  3 = meeting room wall
const MAP: number[][] = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 3, 3, 3, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const TILE = 48;
const COLS = MAP[0]!.length;
const ROWS = MAP.length;
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

// ─── RPG Maker MV Character Spritesheet Layout ────────────────
// Standard MV format: 576×384px total
// 12 characters per sheet (4 cols × 3 rows of characters)
// Each character cell = 144×192px (3 walk frames × 4 directions)
// Each individual frame = 48×48px
//
// We use the FIRST character (top-left cell):
//   Down  frames: row 0, cols 1-3  (middle col = idle)
//   Left  frames: row 1, cols 1-3
//   Right frames: row 2, cols 1-3
//   Up    frames: row 3, cols 1-3
//
// If your image is a different size, adjust CHAR_W / CHAR_H below

const CHAR_FRAME_W = 48; // single frame width  — adjust if needed
const CHAR_FRAME_H = 96; // single frame height — adjust if needed

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
  "keyboardmouse"
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

class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: {
    up:    Phaser.Input.Keyboard.Key;
    down:  Phaser.Input.Keyboard.Key;
    left:  Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };
  private socket!: Socket;
  private otherPlayers: Record<string, Phaser.GameObjects.Sprite> = {};
  private wallGroup!: Phaser.Physics.Arcade.StaticGroup;
  private lastDirection = "down";

  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    // ── load character spritesheet ──
    // Save your Characters_MV.png to apps/web/public/assets/character.png
    this.load.spritesheet("character", "/assets/Characters.png", {
      frameWidth:  CHAR_FRAME_W,
      frameHeight: CHAR_FRAME_H,
    });
    this.load.image("floor",  "/assets/tile.png");
    DECOR_ASSETS.forEach((asset) => {
      this.load.image(asset, `/assets/${asset}.png`);
    });
  }

  create() {
    const mapW = COLS * TILE;
    const mapH = ROWS * TILE;
    const roomId = this.game.registry.get("roomId") as string;

    this.wallGroup = this.physics.add.staticGroup();

    // ── Draw world ───────────────────────────────────────────
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const x    = col * TILE;
        const y    = row * TILE;
        const tile = MAP[row]![col]!;

        // checkerboard floor
        const isAlt = (row + col) % 2 === 0;
        this.add
          .image(x, y, "floor")
          .setOrigin(0)
          .setDepth(0)
          .setDisplaySize(TILE, TILE)  // ← FORCE 48×48 regardless of source size
          .setAlpha(isAlt ? 1 : 0.85); // ← checkerboard effect via opacity

        // meeting room floor tint
        if (row >= 7 && row <= 10 && col >= 5 && col <= 10) {
          this.add
            .rectangle(x, y, TILE, TILE, COLOR.meetingFloor)
            .setOrigin(0).setDepth(0.5);
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

    // ── Room labels ──────────────────────────────────────────
    this.addDecor();

    this.add.text(7.5 * TILE, 8.8 * TILE, "Meeting Room", {
      fontSize: "11px", color: "#aaaacc", fontFamily: "monospace",
    }).setOrigin(0.5).setDepth(3);

    this.add.text(15 * TILE, 2.5 * TILE, "Open Office", {
      fontSize: "11px", color: "#888899", fontFamily: "monospace",
    }).setOrigin(0.5).setDepth(3);

    // ── Register animations ───────────────────────────────────
    // RPG Maker MV standard layout:
    // Each direction has 3 frames: left-step, idle, right-step
    // Row 0 = down, Row 1 = left, Row 2 = right, Row 3 = up
    // Frames per row = depends on image width ÷ 48
    // For a 576px wide sheet: 12 frames per row
    // First character occupies cols 0-2 of each row
    
    //Character 1
    this.anims.create({
      key: "walk-down",
      frames: this.anims.generateFrameNumbers("character", {
        frames: [1, 0, 1, 2], // idle, left-step, idle, right-step
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "walk-left",
      frames: this.anims.generateFrameNumbers("character", {
        frames: [13, 12, 13, 14], // row 1 = left direction
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "walk-right",
      frames: this.anims.generateFrameNumbers("character", {
        frames: [25, 24, 25, 26], // row 2 = right direction
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "walk-up",
      frames: this.anims.generateFrameNumbers("character", {
        frames: [37, 36, 37, 38], // row 3 = up direction
      }),
      frameRate: 8,
      repeat: -1,
    });

    // idle — just the centre frame facing down
    this.anims.create({
      key: "idle",
      frames: [{ key: "character", frame: 1 }],
      frameRate: 1,
      repeat: 0,
    });

    // Character 2 animations (offset by 3 frames)
    this.anims.create({
      key: "other-walk-down",
      frames: this.anims.generateFrameNumbers("character", {
        frames: [4, 3, 4, 5],
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "other-walk-left",
      frames: this.anims.generateFrameNumbers("character", {
        frames: [16, 15, 16, 17],
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "other-walk-right",
      frames: this.anims.generateFrameNumbers("character", {
        frames: [28, 27, 28, 29],
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "other-walk-up",
      frames: this.anims.generateFrameNumbers("character", {
        frames: [40, 39, 40, 41],
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "other-idle",
      frames: [{ key: "character", frame: 4 }], // frame 4 = char 2 idle facing down
      frameRate: 1,
      repeat: 0,
    });

    // ── Player ───────────────────────────────────────────────
    this.player = this.physics.add.sprite(9 * TILE, 5 * TILE, "character");
    this.player.setCollideWorldBounds(true);
    this.player.setDepth(2.8);
    this.player.setScale(1.2); // scale up slightly to match 48px tile size
    this.player.play("idle");

    // tighter physics body (character is smaller than the full frame)
    this.player.setSize(24, 40);
    this.player.setOffset(12, 12);

    this.physics.add.collider(this.player, this.wallGroup);

    // ── Input ────────────────────────────────────────────────
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = {
      up:    this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down:  this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left:  this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };

    // ── Camera ───────────────────────────────────────────────
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, mapW, mapH);
    this.cameras.main.setZoom(1.4);
    this.physics.world.setBounds(0, 0, mapW, mapH);

    // ── Socket.io ────────────────────────────────────────────
    this.socket = io("http://localhost:3001");

    this.socket.emit("player:join", {
      name: "Player1",
      x: this.player.x,
      y: this.player.y,
      roomId,
    });

    this.socket.on("players:init", (players: any[]) => {
      players.forEach((p) => {
        if (p.id !== this.socket.id) this.addOtherPlayer(p);
      });
    });

    this.socket.on(
      "player:joined",
      (p: { id: string; x: number; y: number }) => this.addOtherPlayer(p)
    );

    this.socket.on(
      "player:moved",
      ({ id, x, y, anim }: { id: string; x: number; y: number; anim: string }) => {
        const other = this.otherPlayers[id];
        if (other) {
          other.setPosition(x, y);
          // map local anim key → other player anim key
          const otherAnim = anim === "idle"
            ? "other-idle"
            : anim.replace("walk-", "other-walk-");
          other.play(otherAnim, true);
        }
      }
    );

    this.socket.on("player:left", (id: string) => {
      this.otherPlayers[id]?.destroy();
      delete this.otherPlayers[id];
    });
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
    const wall = this.add.rectangle(
      x + TILE / 2, y + TILE / 2, TILE, TILE, 0x000000, 0
    );
    this.physics.add.existing(wall, true);
    this.wallGroup.add(wall);
  }

  addOtherPlayer(p: { id: string; x: number; y: number }) {
    const sprite = this.add
      .sprite(p.x, p.y, "character")
      .setDepth(5)
      .setScale(1.2)
    sprite.play("other-idle");
    this.otherPlayers[p.id] = sprite;
  }

  update() {
    const speed = 180;
    this.player.setVelocity(0);

    const left  = this.cursors.left.isDown  || this.wasd.left.isDown;
    const right = this.cursors.right.isDown || this.wasd.right.isDown;
    const up    = this.cursors.up.isDown    || this.wasd.up.isDown;
    const down  = this.cursors.down.isDown  || this.wasd.down.isDown;

    let moving = false;
    let currentAnim = `idle`;

    if (left) {
      this.player.setVelocityX(-speed);
      this.player.play("walk-left", true);
      currentAnim = "walk-left";
      this.lastDirection = "left";
      moving = true;
    } else if (right) {
      this.player.setVelocityX(speed);
      this.player.play("walk-right", true);
      currentAnim = "walk-right";
      this.lastDirection = "right";
      moving = true;
    }

    if (up) {
      this.player.setVelocityY(-speed);
      this.player.play("walk-up", true);
      currentAnim = "walk-up";
      this.lastDirection = "up";
      moving = true;
    } else if (down) {
      this.player.setVelocityY(speed);
      this.player.play("walk-down", true);
      currentAnim = "walk-down";
      this.lastDirection = "down";
      moving = true;
    }

    // diagonal normalisation
    if ((left || right) && (up || down)) {
      this.player.body!.velocity.normalize().scale(speed);
    }

    // idle when nothing pressed — face last direction
    if (!moving) {
      this.player.play("idle", true);
      currentAnim = "idle";
    }

    // emit position + current animation so other clients can sync
    this.socket?.emit("player:move", {
      x: this.player.x,
      y: this.player.y,
      anim: currentAnim,
    });
  }

  shutdown() {
    this.socket?.disconnect();
  }
}

interface PhaserGameProps {
  roomId: string;
}

export default function PhaserGame({ roomId }: PhaserGameProps) {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (gameRef.current) return;

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
        },
      },
    });

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [roomId]);

  return <div id="game-container" className="w-full h-screen" />;
}


