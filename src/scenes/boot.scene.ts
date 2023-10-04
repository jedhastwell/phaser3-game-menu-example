import Phaser from 'phaser'

export class BootScene extends Phaser.Scene {
	constructor() {
		super({ key: 'BootScene' })
	}

	init(data: any) {
		console.log(data)

		this.input.setDefaultCursor('url(/assets/input/diamond-sword.cur), default')
	}

	preload() {
		// Preload splash logo to be displayed in the preloader scene.
		this.load.image('logo', 'assets/phaser3-logo.png')
		this.load.image('button-red', 'assets/ui/Outline/red.png')
		this.load.image('button-blue', 'assets/ui/Outline/blue.png')
	}

	create(data: any) {
		console.log(data)
		// Start the preloader
		this.scene.start('MainMenuScene')
	}
}
