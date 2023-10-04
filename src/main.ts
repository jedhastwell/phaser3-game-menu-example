import Phaser from 'phaser'
import config from './config'
import { SettingsScene } from './scenes/settings.scene'
import { BootScene } from './scenes/boot.scene'
import { MainMenuScene } from './scenes/main-menu.scene'
import { LevelsMenuScene } from './scenes/levels-menu.scene'
import { GameScene } from './scenes/game.scene'
import { CreditsScene } from './scenes/credits.scene'

export default new Phaser.Game(
	Object.assign(config, {
		scene: [
			BootScene,
			MainMenuScene,
			LevelsMenuScene,
			GameScene,
			SettingsScene,
			CreditsScene,
		],
	}),
)
