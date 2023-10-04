import Phaser from 'phaser'

export interface IButton {
	image: Phaser.GameObjects.Image | Phaser.GameObjects.NineSlice
	label: Phaser.GameObjects.Text
}

export default class HelloWorldScene extends Phaser.Scene {
	private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
	private buttons: IButton[] = []
	private selectedButtonIndex = 0
	private buttonSelector!: Phaser.GameObjects.Image

	constructor() {
		super('main-menu')
	}

	init() {
		if (!this.input.keyboard) throw new Error('No keyboard found')
		this.cursors = this.input?.keyboard?.createCursorKeys()
	}

	preload() {
		this.load.image('glass-panel', 'assets/glassPanel.png')
		this.load.image('cursor-hand', 'assets/cursor_hand.png')
	}

	create() {
		const { width, height } = this.scale

		// Play button
		const playImage = this.add
			.nineslice(width * 0.5, height * 0.6, 'glass-panel')
			.setDisplaySize(150, 50)
		const playLabel = this.add
			.text(playImage.x, playImage.y, 'Play')
			.setOrigin(0.5)
		const playButton: IButton = {
			image: playImage,
			label: playLabel,
		}

		// Settings button
		const settingsImage = this.add
			.nineslice(
				playButton.image.x,
				playButton.image.y + playButton.image.displayHeight + 10,
				'glass-panel',
			)
			.setDisplaySize(150, 50)
		const settingsLabel = this.add
			.text(settingsImage.x, settingsImage.y, 'Settings')
			.setOrigin(0.5)
		const settingsButton: IButton = {
			image: settingsImage,
			label: settingsLabel,
		}

		// Credits button
		const creditsImage = this.add
			.nineslice(
				settingsButton.image.x,
				settingsButton.image.y + settingsButton.image.displayHeight + 10,
				'glass-panel',
			)
			.setDisplaySize(150, 50)
		const creditsLabel = this.add
			.text(creditsImage.x, creditsImage.y, 'Credits')
			.setOrigin(0.5)
		const creditsButton: IButton = {
			image: creditsImage,
			label: creditsLabel,
		}

		this.buttons.push(playButton)
		this.buttons.push(settingsButton)
		this.buttons.push(creditsButton)

		this.buttonSelector = this.add.image(0, 0, 'cursor-hand')

		this.selectButton(0)

		playButton.image.on('selected', () => {
			console.log('play')
		})

		settingsButton.image.on('selected', () => {
			console.log('settings')
		})

		settingsButton.image.on('mousemove', () => {
			console.log('settings!!!!!')
		})

		creditsButton.image.on('selected', () => {
			console.log('credits')
		})

		this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
			playButton.image.off('selected')
		})
	}

	selectButton(index: number) {
		const currentButton = this.buttons[this.selectedButtonIndex]

		// set the current selected button to a white tint
		currentButton.image.setTint(0xffffff)

		const button = this.buttons[index]

		// set the newly selected button to a green tint
		button.image.setTint(0xff66ff)

		// move the hand cursor to the right edge
		this.buttonSelector.x = button.image.x + button.image.displayWidth * 0.5
		this.buttonSelector.y = button.image.y + 10

		// store the new selected index
		this.selectedButtonIndex = index
	}

	selectNextButton(change = 1) {
		let index = this.selectedButtonIndex + change

		// wrap the index to the front or end of array
		if (index >= this.buttons.length) {
			index = 0
		} else if (index < 0) {
			index = this.buttons.length - 1
		}

		this.selectButton(index)
	}

	confirmSelection() {
		// get the currently selected button
		const button = this.buttons[this.selectedButtonIndex]

		// emit the 'selected' event
		button.image.emit('selected')
	}

	update() {
		const upJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up!)
		const downJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.down!)
		const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space!)

		if (upJustPressed) {
			this.selectNextButton(-1)
		} else if (downJustPressed) {
			this.selectNextButton(1)
		} else if (spaceJustPressed) {
			this.confirmSelection()
		}
	}
}
