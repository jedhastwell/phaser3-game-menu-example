import Phaser from 'phaser'
import gameState from '../model/gameState'
import levels, { ILevel } from '../data/levels'

export class GameScene extends Phaser.Scene {
	constructor(
		private levelIndex: number,
		private levelData: ILevel,
	) {
		super({ key: 'GameScene' })
	}

	init(data: { levelIndex: number }) {
		this.levelIndex = data.levelIndex
		this.levelData = levels[this.levelIndex]
	}

	preload() {}

	create() {
		const backButton = this.add.text(10, 10, this.levelData.name, {
			font: '48px Arial',
			// @ts-ignore
			fill: '#000000',
		})
		backButton.setInteractive({
			cursor: 'url(/assets/input/sword-glowing.cur), pointer',
		})
		backButton.on('pointerup', () => this.scene.start('LevelsMenuScene'))

		const hero = this.add.sprite(
			26 + this.levelIndex * 70,
			80,
			'hero-run-sheet',
			1,
		)
		hero.anims.play('hero-running')

		const loseButton = this.add.text(300, 400, 'Lose', {
			font: '40px Arial',
			// @ts-ignore
			fill: '#000000',
		})
		loseButton.setInteractive({
			cursor: 'url(/assets/input/sword-glowing.cur), pointer',
		})
		loseButton.on('pointerup', this.failLevel, this)
		const winButton = this.add.text(500, 400, 'Win', {
			font: '40px Arial',
			// @ts-ignore
			fill: '#000000',
		})
		winButton.setInteractive({
			cursor: 'url(/assets/input/sword-glowing.cur), pointer',
		})
		winButton.on('pointerup', this.completeLevel, this)
	}

	failLevel() {
		this.scene.start('LevelsMenuScene')
	}

	completeLevel() {
		gameState.completeLevel(this.levelIndex)
		this.scene.start('LevelsMenuScene')
	}

	update() {}
}
