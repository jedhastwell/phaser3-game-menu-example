import Phaser from 'phaser'
import { Button } from '../components/button'

export class MainMenuScene extends Phaser.Scene {
	constructor() {
		super({ key: 'MainMenuScene' })
	}

	init() {}

	preload() {
		const { width, height } = this.scale
		// Add splash logo to the scene while content is preloading.
		this.add.image(400, 200, 'logo')
		const menuTop = height * 0.5 - 30
		const menuGap = 55

		new Button({
			scene: this,
			text: 'Play',
			x: width * 0.5,
			y: menuTop + menuGap,
			width: 200,
			height: 100,
			fontStyle: {
				font: '30px Arial',
				color: '#000',
			},
			onClick: () => {
				this.scene.start('LevelsMenuScene')
			},
		})

		new Button({
			scene: this,
			text: 'Settings',
			x: width * 0.5,
			y: menuTop + menuGap * 2,
			width: 200,
			height: 100,
			fontStyle: {
				font: '30px Arial',
				color: '#000',
			},
			onClick: () => {
				this.scene.start('SettingsScene')
			},
		})

		new Button({
			scene: this,
			text: 'Credits',
			x: width * 0.5,
			y: menuTop + menuGap * 3,
			width: 200,
			height: 100,
			fontStyle: {
				font: '30px Arial',
				color: '#000',
			},
			onClick: () => {
				this.scene.start('CreditsScene')
			},
		})

		new Button({
			scene: this,
			text: 'Exit',
			x: width * 0.5,
			y: menuTop + menuGap * 4,
			width: 200,
			height: 100,
			fontStyle: {
				font: '30px Arial',
				color: '#000',
			},
			onClick: () => {
				window.alert('Всё, пока!')
			},
		})
	}

	create() {}

	update() {}
}
