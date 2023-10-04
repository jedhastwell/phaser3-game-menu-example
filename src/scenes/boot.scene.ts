import Phaser from 'phaser'

export class BootScene extends Phaser.Scene {
	constructor() {
		super({ key: 'BootScene' })
	}

	init() {
		this.input.setDefaultCursor('url(/assets/input/diamond-sword.cur), default')
		const progressBar = this.add.graphics()
		const progressBox = this.add.graphics()
		progressBox.fillStyle(0x222222, 0.8)
		progressBox.fillRect(240, 270, 320, 50)

		const { width, height } = this.scale
		const loadingText = this.make.text({
			x: width / 2,
			y: height / 2 - 50,
			text: 'Loading...',
			style: {
				font: '20px Arial',
				//@ts-ignore
				fill: '#ffffff',
			},
		})
		loadingText.setOrigin(0.5, 0.5)

		const percentText = this.make.text({
			x: width / 2,
			y: height / 2 - 5,
			text: '0%',
			style: {
				font: '18px Arial',
				//@ts-ignore
				fill: '#ffffff',
			},
		})
		percentText.setOrigin(0.5, 0.5)

		const assetText = this.make.text({
			x: width / 2,
			y: height / 2 + 50,
			text: '',
			style: {
				font: '18px Arial',
				//@ts-ignore
				fill: '#ffffff',
			},
		})
		assetText.setOrigin(0.5, 0.5)

		this.load.on('progress', function (value: number) {
			console.log(value)
			progressBar.clear()
			progressBar.fillStyle(0xffffff, 1)
			progressBar.fillRect(250, 280, 300 * value, 30)
			percentText.setText(parseInt(String(value * 100)) + '%')
		})

		this.load.on('fileprogress', (file: { src: string; key: string }) => {
			assetText.setText('Loading asset: ' + file.src)
		})
		this.load.on('complete', function () {
			console.log('complete')
			progressBar.destroy()
			progressBox.destroy()
			loadingText.destroy()
			percentText.destroy()
			assetText.destroy()
		})
	}

	preload() {
		console.log('Preload')
		// Preload splash logo to be displayed in the preloader scene.
		this.load.image('logo', 'assets/phaser3-logo.png')
		this.load.image('button-red', 'assets/ui/Outline/red.png')
		this.load.image('button-blue', 'assets/ui/Outline/blue.png')
		this.load.spritesheet('hero-run-sheet', 'assets/hero/run.png', {
			frameWidth: 32,
			frameHeight: 64,
		})

		// Create global animations
		this.anims.create({
			key: 'hero-running',
			frames: this.anims.generateFrameNumbers('hero-run-sheet'),
			frameRate: 10,
			repeat: -1,
		})
	}

	create() {
		this.scene.start('MainMenuScene')
	}
}
