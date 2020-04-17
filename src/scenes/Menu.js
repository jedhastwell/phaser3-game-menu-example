import Phaser from 'phaser';
import gameState from '../model/gameState';
import levels from '../data/levels';

class Menu extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  init(data) {}

  preload() {}

  create(data) {
    this.add.text(10, 10, `Menu`, { font: '48px Arial', fill: '#000000' });

    // Add level menu buttons.
    const itemsPerRow = 4;
    for (let i = 0; i < levels.length; i ++) {
      const unlocked = i <= gameState.maxUnlockedLevel();
      const button = this.add.text(
        80 + (i % itemsPerRow) * 150, 
        140 + Math.floor(i / itemsPerRow) * 120, 
        levels[i].name, 
        {
          font: '30px Arial',
          fill: '#000000',
        }
      );
      button.alpha = unlocked ? 1 : 0.5;
      if (unlocked) {
        button.setInteractive();
        // When menu button is clicked, switch to game scene and pass along the index for the selected level.
        button.on('pointerup', () => this.scene.start('GameScene', { levelIndex: i }));
      }
    }

  }

  update(time, delta) {}
}

export default Menu;