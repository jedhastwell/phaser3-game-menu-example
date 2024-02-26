import Phaser from 'phaser'

export class SettingsScene extends Phaser.Scene {
	private settings: Phaser.GameObjects.Text = {} as Phaser.GameObjects.Text
	private angle = 0

	constructor() {
		super({ key: 'SettingsScene' })
	}

	init() {}

	preload() {}

	create() {
		const backButton = this.add.text(10, 10, '<=Back', {
			font: '48px Arial',
			// @ts-ignore
			color: '#000000',
		})
		backButton.setInteractive({
			cursor: 'url(assets/input/sword-glowing.cur), pointer',
		})
		backButton.on('pointerup', () => this.scene.start('MainMenuScene'))

		const { width, height } = this.scale
		this.settings = this.add
			.text(width * 0.5, height * 0.5, 'Settings may be here', {
				font: '48px Arial',
				// @ts-ignore
				color: '#000000',
			})
			.setOrigin(0.5)
	}

	update() {
		this.settings.setAngle(this.angle)
		this.angle += 1
	}
}
