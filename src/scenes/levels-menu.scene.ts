import Phaser from 'phaser'
import gameState from '../model/gameState'
import levels from '../data/levels'

export class LevelsMenuScene extends Phaser.Scene {
	levelsBlock: any
	constructor() {
		super({ key: 'LevelsMenuScene' })
	}

	init() {}

	preload() {}

	create() {
		const menu = this.add.text(10, 10, `Levels menu`, {
			font: '48px Arial',
			// @ts-ignore
			color: '#000000',
		})

		menu.setInteractive({
			cursor: 'url(/assets/input/sword-glowing.cur), pointer',
		})
		menu.on('pointerup', () => this.scene.start('MainMenuScene'))

		const { width, height } = this.scale
		// Add level menu buttons.

		const itemsPerRow = 4
		this.levelsBlock = this.add.container(
			width * 0.5 - (80 + itemsPerRow * 150) / 2,
			height * 0.5 - (140 + Math.floor(levels.length / itemsPerRow) * 120) / 2,
		)
		for (let i = 0; i < levels.length; i++) {
			const unlocked = i <= gameState.maxUnlockedLevel()
			const button = this.add.text(
				80 + (i % itemsPerRow) * 150,
				140 + Math.floor(i / itemsPerRow) * 120,
				levels[i].name,
				{
					font: '30px Arial',
					// @ts-ignore
					color: '#000000',
				},
			)
			this.levelsBlock.add(button, true)
			button.alpha = unlocked ? 1 : 0.5
			button.setPosition(
				80 + (i % itemsPerRow) * 150,
				40 + Math.floor(i / itemsPerRow) * 120,
			)
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
