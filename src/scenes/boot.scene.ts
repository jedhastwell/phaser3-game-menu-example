import Phaser from 'phaser'

export class BootScene extends Phaser.Scene {
	constructor() {
		super({ key: 'BootScene' })
	}

	init() {
		this.input.setDefaultCursor('url(assets/input/diamond-sword.cur), default')
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
				color: '#ffffff',
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
				color: '#ffffff',
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
				color: '#ffffff',
			},
		})
		assetText.setOrigin(0.5, 0.5)

		this.load.on('progress', function (value: number) {
			progressBar.clear()
			progressBar.fillStyle(0xffffff, 1)
			progressBar.fillRect(250, 280, 300 * value, 30)
			percentText.setText(parseInt(String(value * 100)) + '%')
		})

		this.load.on('fileprogress', (file: { src: string; key: string }) => {
			assetText.setText('Loading asset: ' + file.src)
		})
		this.load.on('complete', function () {
			progressBar.destroy()
			progressBox.destroy()
			loadingText.destroy()
			percentText.destroy()
			assetText.destroy()
		})
	}

	preload() {
		// Preload splash logo to be displayed in the preloader scene.
		this.load.image('logo', 'assets/phaser3-logo.png')
		this.load.image('button-red', 'assets/ui/Outline/red.png')
		this.load.image('button-blue', 'assets/ui/Outline/blue.png')
		this.load.spritesheet('hero-run-sheet', 'assets/hero/run.png', {
			frameWidth: 32,
			frameHeight: 64,
		})

		this.load.image('sky', 'assets/map/sky.png')
		this.load.image('ground', 'assets/map/platform.png')
		this.load.image('star', 'assets/map/star.png')
		this.load.image('bomb', 'assets/map/bomb.png')
		this.load.spritesheet('dude', 'assets/map/dude.png', {
			frameWidth: 32,
			frameHeight: 48,
		})
	}

	create() {
		// Create global animations
		this.anims.create({
			key: 'hero-running',
			frames: this.anims.generateFrameNumbers('hero-run-sheet'),
			frameRate: 10,
			repeat: -1,
		})
		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
			frameRate: 10,
			repeat: -1,
		})

		this.anims.create({
			key: 'turn',
			frames: [{ key: 'dude', frame: 4 }],
			frameRate: 20,
		})

		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
			frameRate: 10,
			repeat: -1,
		})

		this.scene.start('MainMenuScene')
	}
}
