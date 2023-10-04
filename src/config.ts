import Phaser from 'phaser'
import { Plugin } from 'phaser3-nineslice'

export default {
	type: Phaser.AUTO,
	parent: 'app',
	backgroundColor: '#33A5E7',
	scale: {
		width: 800,
		height: 600,
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
	},
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 },
		},
	},
	plugins: {
		// add to plugins.global 👇
		global: [Plugin.DefaultCfg],
	},
}
