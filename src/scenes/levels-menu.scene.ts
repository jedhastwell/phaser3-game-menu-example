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
			cursor: 'url(assets/input/sword-glowing.cur), pointer',
		})
		menu.on('pointerup', () => this.scene.start('MainMenuScene'))

		const { width } = this.scale
		// Add level menu buttons.

		const itemsPerRow = 4
		this.levelsBlock = this.add.container(
			width * 0.5 - (120 + itemsPerRow * 130) / 2,
			10,
		)
		for (let i = 0; i < levels.length; i++) {
			const unlocked = i <= gameState.maxUnlockedLevel()

			const button = this.add
				.nineslice(
					70 + (i % itemsPerRow) * 130,
					140 + Math.floor(i / itemsPerRow) * 60,
					'button-blue',
				)
				.setOrigin(0, 0.5)
				.setSize(120, 50)
			this.add
				.text(
					80 + (i % itemsPerRow) * 130,
					150 + Math.floor(i / itemsPerRow) * 60,
					levels[i].name,
					{
						font: '26px Arial',
						// @ts-ignore
						color: '#000000',
					},
				)
				.setOrigin(0.5)

			this.levelsBlock.add(button, true)
			button.alpha = unlocked ? 1 : 0.5

			if (unlocked) {
				button.setInteractive({
					cursor: 'url(assets/input/sword-glowing.cur), pointer',
				})

				button.on('pointerover', () => {
					button.setTexture('button-red')
				})

				button.on('pointerout', () => {
					button.setTexture('button-blue')
				})
				button.on('pointerdown', () => {
					button.setTint(0xff66ff)
				})
				button.on('pointerup', () => {
					button.setTint(0xffffff)
					this.scene.start('GameScene', { levelIndex: i })
				})
			}
		}
	}

	update() {}
}
