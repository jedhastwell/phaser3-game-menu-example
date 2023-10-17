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
	private platformItemsLeft = [] as {
		platform: Phaser.GameObjects.GameObject
		isTweening: boolean
	}[]
	platformItemsRight = [] as {
		platform: Phaser.GameObjects.GameObject
		isTweening: boolean
	}[]
	private buttons = {} as {
		left: Phaser.GameObjects.Image
		right: Phaser.GameObjects.Image
		up1: Phaser.GameObjects.Image
		up2: Phaser.GameObjects.Image
	}

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

		this.setControlButtons()

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
			.text(
				width - 16,
				16,
				`score: ${this.score} of ${100 * (this.levelIndex + 1)}`,
				{
					fontSize: '32px',
					color: '#000',
				},
			)
			.setOrigin(1, 0)
	}

	private createStars() {
		this.stars = this.physics.add.group({
			key: 'star',
			repeat: 9,
			setXY: { x: 12, y: 0, stepX: 44 },
		})

		this.stars.children.iterate((child: any) => {
			child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
			return true
		})
		this.physics.add.collider(this.stars, this.platforms)
	}

	private createPlayer() {
		const { width, height } = this.scale
		this.player = this.physics.add.sprite(width / 2, height / 2, 'dude')

		this.player.setBounce(0.2)
		this.player.setCollideWorldBounds(true)

		this.player.body.setGravityY(300)

		//===

		if (!this.input.keyboard) throw new Error('No keyboard found')
		this.cursors = this.input.keyboard.createCursorKeys()

		//===

		this.physics.add.collider(this.player, this.platforms)
	}

	private createMap() {
		this.add.image(0, 0, 'sky').setOrigin(0, 0).setDisplaySize(540, 960)
		this.platforms = this.physics.add.staticGroup()
		this.platformItemsLeft = []
		this.platformItemsRight = []

		this.platforms
			.create(0, 960, 'ground')
			.setOrigin(0, 1)
			.setScale(1)
			.setDisplaySize(540, 50)
			.setTint(0x00ff00)
			.refreshBody()

		for (let i = 1; i <= 8; i++) {
			const platformLeft = this.platforms
				.create(
					-350 + Phaser.Math.Between(0, 150),
					i * 96 + Phaser.Math.Between(-30, 30),
					'ground',
				)
				.setOrigin(0, 0)
				.refreshBody()

			this.platformItemsLeft.push({
				platform: platformLeft,
				isTweening: false,
			})

			const platformRight = this.platforms
				.create(
					540 + 350 - Phaser.Math.Between(0, 200),
					i * 96 + Phaser.Math.Between(-30, 30),
					'ground',
				)
				.setOrigin(1, 0)
				.refreshBody()

			this.platformItemsRight.push({
				platform: platformRight,
				isTweening: false,
			})
		}
	}

	private setBackButton() {
		const backButton = this.add.text(10, 10, this.levelData.name, {
			font: '48px Arial',
			color: '#000000',
		})
		backButton.setInteractive({
			cursor: 'url(assets/input/sword-glowing.cur), pointer',
		})
		backButton.on('pointerup', () => this.scene.start('LevelsMenuScene'))
	}

	hitBomb(player: any, bomb: any) {
		this.failLevel(player, bomb)
	}

	collectStar(player: any, star: any) {
		star.disableBody(true, true)
		this.score += 10
		this.scoreText.setText(
			`score: ${this.score} of ${100 * (this.levelIndex + 1)}
			(${this.stars.countActive(true)})`,
		)

		if (this.score >= 100 * (this.levelIndex + 1)) {
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
						? Phaser.Math.Between(270, 540)
						: Phaser.Math.Between(0, 270)
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

	movePlatform(platform: any, move: number = -200) {
		platform.isTweening = true
		this.tweens.add({
			targets: platform.platform,
			x: move,
			yoyo: false,
			duration: 2000,
			repeat: 0,
			onUpdate: () => {
				platform.platform.refreshBody()
			},
			onComplete: () => {
				platform.isTweening = false
				platform.platform.refreshBody()
			},
		})
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
		const isMovingTime = Phaser.Math.Between(0, 100) >= 90
		if (isMovingTime) {
			const platformIndex = Phaser.Math.Between(0, 7)
			if (Phaser.Math.Between(0, 100) >= 50) {
				this.movePlatform(
					this.platformItemsLeft[platformIndex],
					Phaser.Math.Between(-200, -400),
				)
			} else {
				this.movePlatform(
					this.platformItemsRight[platformIndex],
					Phaser.Math.Between(700, 930),
				)
			}
		}

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

	private leftFires() {
		this.cursors.left.isDown = true
		this.buttons.left.setTint(0x00ff00)
	}
	private leftRelease() {
		this.cursors.left.isDown = false
		this.buttons.left.setTint(0xffffff)
	}

	private rightFires() {
		this.cursors.right.isDown = true
		this.buttons.right.setTint(0x00ff00)
	}
	private rightRelease() {
		this.cursors.right.isDown = false
		this.buttons.right.setTint(0xffffff)
	}

	private upFires() {
		this.cursors.up.isDown = true
		this.buttons.up1.setTint(0x0000ff)
		this.buttons.up2.setTint(0x0000ff)
	}
	private upRelease() {
		this.cursors.up.isDown = false
		this.buttons.up1.setTint(0xffffff)
		this.buttons.up2.setTint(0xffffff)
	}

	private setControlButtons() {
		const { width, height } = this.scale
		this.buttons.left = this.add
			.image(10, height - 115, 'button-green-left')
			.setOrigin(0, 0)
			.setDisplaySize(64, 64)
			.setInteractive({
				cursor: 'url(assets/input/sword-glowing.cur), pointer',
			})
		this.buttons.left.on('pointerdown', () => {
			this.leftFires()
		})
		this.buttons.left
			.on('pointerleave', () => {
				this.leftRelease()
			})
			.on('pointerup', () => {
				this.leftRelease()
			})

		this.buttons.right = this.add
			.image(width - 10, height - 115, 'button-green-right')
			.setOrigin(1, 0)
			.setDisplaySize(64, 64)
			.setInteractive({
				cursor: 'url(assets/input/sword-glowing.cur), pointer',
			})
		this.buttons.right.on('pointerdown', () => {
			this.rightFires()
		})
		this.buttons.right
			.on('pointerleave', () => {
				this.rightRelease()
			})
			.on('pointerup', () => {
				this.rightRelease()
			})

		this.buttons.up1 = this.add
			.image(80, height - 165, 'button-blue-up')
			.setOrigin(0, 0)
			.setDisplaySize(64, 64)
			.setInteractive({
				cursor: 'url(assets/input/sword-glowing.cur), pointer',
			})
		this.buttons.up1.on('pointerdown', () => {
			this.upFires()
		})
		this.buttons.up1
			.on('pointerleave', () => {
				this.upRelease()
			})
			.on('pointerup', () => {
				this.upRelease()
			})

		this.buttons.up2 = this.add
			.image(width - 80, height - 165, 'button-blue-up')
			.setOrigin(1, 0)
			.setDisplaySize(64, 64)
			.setInteractive({
				cursor: 'url(assets/input/sword-glowing.cur), pointer',
			})
		this.buttons.up2.on('pointerdown', () => {
			this.upFires()
		})
		this.buttons.up2
			.on('pointerup', () => {
				this.upRelease()
			})
			.on('pointerleave', () => {
				this.upRelease()
			})
	}
}
