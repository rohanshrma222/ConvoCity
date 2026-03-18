// apps/web/src/components/PhaserGame.tsx
"use client";
import { useEffect, useRef } from "react";
import Phaser from "phaser";

class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    // placeholder colored rectangle as player for now
    this.load.image("tiles", "/assets/tileset.png");
  }

  create() {
    // temp player — replace with sprite sheet later
    const graphics = this.add.graphics();
    graphics.fillStyle(0x4f46e5);
    graphics.fillRect(0, 0, 32, 32);
    graphics.generateTexture("player", 32, 32);
    graphics.destroy();

    this.player = this.physics.add.sprite(400, 300, "player");
    this.player.setCollideWorldBounds(true);
    this.cursors = this.input.keyboard!.createCursorKeys();

    // camera follows player
    this.cameras.main.startFollow(this.player);
  }

  update() {
    const speed = 160;
    this.player.setVelocity(0);

    if (this.cursors.left.isDown)  this.player.setVelocityX(-speed);
    if (this.cursors.right.isDown) this.player.setVelocityX(speed);
    if (this.cursors.up.isDown)    this.player.setVelocityY(-speed);
    if (this.cursors.down.isDown)  this.player.setVelocityY(speed);
  }
}

export default function PhaserGame() {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (gameRef.current) return;

    gameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      physics: { default: "arcade", arcade: { gravity: { x: 0, y: 0 } } },
      scene: [GameScene],
      parent: "game-container",
    });

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return <div id="game-container" className="w-full h-screen" />;
}