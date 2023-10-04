import Phaser from 'phaser'
import config from './config'
import BootScene from './scenes/Boot'
import PreloaderScene from './scenes/MainMenu'
import MenuScene from './scenes/LevelsMenu'
import GameScene from './scenes/Game'

export default new Phaser.Game(
	Object.assign(config, {
		scene: [BootScene, PreloaderScene, MenuScene, GameScene],
	}),
)
