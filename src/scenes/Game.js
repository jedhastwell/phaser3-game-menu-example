import Phaser from 'phaser';
import gameState from '../model/gameState';
import levels from '../data/levels';

class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init(data) {
    this.levelIndex = data.levelIndex;
    this.levelData = levels[this.levelIndex];
  }

  preload() {}

  create(data) {
    this.add.text(10, 10, this.levelData.name, { font: '48px Arial', fill: '#000000' });

    const hero = this.add.sprite(26 + this.levelIndex * 70, 80, 'hero-run-sheet', 1);
    hero.anims.play('hero-running');

    const loseButton = this.add.text(300, 400, 'Lose', { font: '40px Arial', fill: '#000000' });
    loseButton.setInteractive();
    loseButton.on('pointerup', this.failLevel, this);
    const winButton = this.add.text(500, 400, 'Win', { font: '40px Arial', fill: '#000000' });
    winButton.setInteractive();
    winButton.on('pointerup', this.completeLevel, this);
  }

  failLevel() {
    this.scene.start('MenuScene');
  }
  
  completeLevel() {
    gameState.completeLevel(this.levelIndex);
    this.scene.start('MenuScene');
  }

  update(time, delta) {}
}

export default Game;