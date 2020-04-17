
import Phaser from 'phaser';

class Preloader extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloaderScene' });
  }

  init(data) {}

  preload() {
    // Add splash logo to the scene while content is preloading.
    this.add.image(400, 300, 'logo');
    
    // Preload all other required assets.
    this.load.setPath('assets');
    this.load.spritesheet('hero-run-sheet', 'hero/run.png', {
      frameWidth: 32,
      frameHeight: 64,
    });
  }

  create(data) {
    // Create global animations
    this.anims.create({
      key: 'hero-running',
      frames: this.anims.generateFrameNumbers('hero-run-sheet'),
      frameRate: 10,
      repeat: -1,
    });

    // All preloading and initialization is done. Add start button. (Could alternatively switch straight to menu).
    const startButton = this.add.text(400, 450, 'START', { font: '40px Arial', fill: '#000000' });
    startButton.setInteractive();
    startButton.setOriginFromFrame();
    startButton.on('pointerup', () => this.scene.start('MenuScene'));
  }

}

export default Preloader;