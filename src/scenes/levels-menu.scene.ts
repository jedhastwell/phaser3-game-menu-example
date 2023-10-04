import Phaser from 'phaser'
import gameState from '../model/gameState'
import levels from '../data/levels'

export class LevelsMenuScene extends Phaser.Scene {
	constructor() {
		super({ key: 'LevelsMenuScene' })
	}

	init() {}

	preload() {}

	create() {
		const menu = this.add.text(10, 10, `Levels menu`, {
			font: '48px Arial',
			// @ts-ignore
			fill: '#000000',
		})

		menu.setInteractive({
			cursor: 'url(/assets/input/sword-glowing.cur), pointer',
		})
		menu.on('pointerup', () => this.scene.start('MainMenuScene'))

		// Add level menu buttons.
		const itemsPerRow = 4
		for (let i = 0; i < levels.length; i++) {
			const unlocked = i <= gameState.maxUnlockedLevel()
			const button = this.add.text(
				80 + (i % itemsPerRow) * 150,
				140 + Math.floor(i / itemsPerRow) * 120,
				levels[i].name,
				{
					font: '30px Arial',
					// @ts-ignore
					fill: '#000000',
				},
			)
			button.alpha = unlocked ? 1 : 0.5
			if (unlocked) {
				button.setInteractive({
					cursor: 'url(/assets/input/sword-glowing.cur), pointer',
				})
				// When menu button is clicked, switch to game scene and pass along the index for the selected level.
				button.on('pointerup', () =>
					this.scene.start('GameScene', { levelIndex: i }),
				)
			}
		}
	}

	update() {}
}
