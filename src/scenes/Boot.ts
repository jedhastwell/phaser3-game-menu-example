import Phaser from 'phaser'

class Boot extends Phaser.Scene {
	constructor() {
		super({ key: 'BootScene' })
	}

	init(data: any) {
		console.log(data)

		this.input.setDefaultCursor('url(/assets/input/diamond-sword.cur), pointer')
	}

	preload() {
		// Preload splash logo to be displayed in the preloader scene.
		this.load.image('logo', 'assets/phaser3-logo.png')
	}

	create(data: any) {
		console.log(data)
		// Start the preloader
		this.scene.start('MainMenuScene')
	}
}

export default Boot
