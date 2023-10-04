import Phaser from 'phaser'
import gameState from '../model/gameState'
import levels, { ILevel } from '../data/levels'

export class GameScene extends Phaser.Scene {
	private cursors = {} as Phaser.Types.Input.Keyboard.CursorKeys
	private player = {} as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
	private stars = {} as Phaser.Physics.Arcade.Group
	private score = 0
	private scoreText = {} as Phaser.GameObjects.Text
	private bombs = {} as Phaser.Physics.Arcade.Group
	private platforms = {} as Phaser.Physics.Arcade.StaticGroup

	constructor(
		private levelIndex: number,
		private levelData: ILevel,
	) {
		super({ key: 'GameScene' })
	}

	init(data: { levelIndex: number }) {
		this.levelIndex = data.levelIndex
		this.levelData = levels[this.levelIndex]
	}

	preload() {
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
		const { width } = this.scale

		this.createMap()

		//===

		this.createPlayer()

		//===

		this.createStars()

		//===

		this.physics.add.overlap(
			this.player,
			this.stars,
			this.collectStar,
			undefined,
			this,
		)

		//===

		this.createScore(width)

		//===

		this.bombs = this.physics.add.group()
		this.physics.add.collider(this.bombs, this.platforms)
		this.physics.add.collider(
			this.player,
			this.bombs,
			this.hitBomb,
			undefined,
			this,
		)

		//===

		//===

		this.setBackButton()
	}

	private createScore(width: number) {
		this.scoreText = this.add
			.text(width - 16, 16, 'score: ' + this.score, {
				fontSize: '32px',
				color: '#000',
			})
			.setOrigin(1, 0)
	}

	private createStars() {
		this.stars = this.physics.add.group({
			key: 'star',
			repeat: 11,
			setXY: { x: 12, y: 0, stepX: 70 },
		})

		this.stars.children.iterate((child: any) => {
			child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
			return true
		})
		this.physics.add.collider(this.stars, this.platforms)
	}

	private createPlayer() {
		this.player = this.physics.add.sprite(100, 450, 'dude')

		this.player.setBounce(0.2)
		this.player.setCollideWorldBounds(true)

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

		this.player.body.setGravityY(300)

		//===

		if (!this.input.keyboard) throw new Error('No keyboard found')
		this.cursors = this.input.keyboard.createCursorKeys()

		//===

		this.physics.add.collider(this.player, this.platforms)
	}

	private createMap() {
		this.add.image(400, 300, 'sky')
		this.platforms = this.physics.add.staticGroup()

		this.platforms.create(400, 568, 'ground').setScale(2).refreshBody()

		this.platforms.create(600, 400, 'ground')
		this.platforms.create(50, 250, 'ground')
		this.platforms.create(750, 220, 'ground')
	}

	private setBackButton() {
		const backButton = this.add.text(10, 10, this.levelData.name, {
			font: '48px Arial',
			// @ts-ignore
			color: '#000000',
		})
		backButton.setInteractive({
			cursor: 'url(/assets/input/sword-glowing.cur), pointer',
		})
		backButton.on('pointerup', () => this.scene.start('LevelsMenuScene'))
	}

	hitBomb(player: any, bomb: any) {
		this.failLevel(player, bomb)
	}

	collectStar(player: any, star: any) {
		star.setTint(0xffff00)
		star.disableBody(true, false)
		setTimeout(() => {
			this.score += 10
			this.scoreText.setText('Score: ' + this.score)
			star.disableBody(true, true)
		}, 300)

		if (this.score >= 300) {
			this.completeLevel(player)
		}

		if (this.stars.countActive(true) === 0) {
			this.stars.children.iterate((child: any) => {
				child.enableBody(true, child.x, 0, true, true)
				return true
			})

			for (let i = 0; i <= this.levelIndex; i++) {
				const x =
					player.x < 400
						? Phaser.Math.Between(400, 800)
						: Phaser.Math.Between(0, 400)
				const bomb = this.bombs.create(x, 16, 'bomb')
				bomb.setBounce(1)
				bomb.setCollideWorldBounds(true)
				bomb.setVelocity(Phaser.Math.Between(-200, 200), 20)
			}
		}
	}

	failLevel(player: any, bomb: any) {
		const { width, height } = this.scale
		this.physics.pause()
		player.setTint(0xff0000)
		bomb.setTint(0xff0000)
		player.anims.play('turn')

		this.add
			.text(width * 0.5, height * 0.5, 'You loose!', {
				font: '80px Arial',
				shadow: {
					color: '#333',
					blur: 5,
					offsetY: 5,
					offsetX: 5,
					fill: true,
					stroke: true,
				},
				color: '#f00',
			})
			.setOrigin(0.5)

		setTimeout(() => {
			this.score = 0
			this.scene.start('LevelsMenuScene')
		}, 1000)
	}

	completeLevel(player: any) {
		const { width, height } = this.scale
		this.physics.pause()
		player.setTint(0x00ff00)
		player.anims.play('turn')
		gameState.completeLevel(this.levelIndex)

		this.add
			.text(width * 0.5, height * 0.5, 'You win!', {
				font: '80px Arial',
				shadow: {
					color: '#333',
					blur: 5,
					offsetY: 5,
					offsetX: 5,
					fill: true,
					stroke: true,
				},
				color: '#0f0',
			})
			.setOrigin(0.5)

		setTimeout(() => {
			this.score = 0
			this.scene.start('LevelsMenuScene')
		}, 1000)
	}

	update() {
		if (!this.cursors) return

		if (this.cursors.left.isDown) {
			this.player.setVelocityX(-160)

			this.player.anims.play('left', true)
		} else if (this.cursors.right.isDown) {
			this.player.setVelocityX(160)

			this.player.anims.play('right', true)
		} else {
			this.player.setVelocityX(0)

			this.player.anims.play('turn')
		}

		if (this.cursors.up.isDown && this.player.body.touching.down) {
			this.player.setVelocityY(-500)
		}
	}
}
