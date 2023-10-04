import Phaser from 'phaser'

export class CreditsScene extends Phaser.Scene {
	private credits: Phaser.GameObjects.Text = {} as Phaser.GameObjects.Text
	private angle = 0

	constructor() {
		super({ key: 'CreditsScene' })
	}

	init() {}

	preload() {}

	create() {
		const backButton = this.add.text(10, 10, '<=Back', {
			font: '48px Arial',
			// @ts-ignore
			fill: '#000000',
		})
		backButton.setInteractive({
			cursor: 'url(/assets/input/sword-glowing.cur), pointer',
		})
		backButton.on('pointerup', () => this.scene.start('MainMenuScene'))

		const { width, height } = this.scale
		this.credits = this.add
			.text(width * 0.5, height * 0.5, 'Credits here', {
				font: '48px Arial',
				// @ts-ignore
				fill: '#000000',
			})
			.setOrigin(0.5)
	}

	update() {
		this.credits.setAngle(this.angle)
		this.angle += 1
	}
}
