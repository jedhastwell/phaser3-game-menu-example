export class Button {
	public image: any
	public label: any

	constructor(props: {
		scene: Phaser.Scene
		texture?: any
		text?: string
		x: number
		y: number
		width: number
		height: number
		fontStyle?: any
		imageHover?: any
		onClick: any
	}) {
		const {
			scene,
			texture,
			imageHover,
			height,
			onClick,
			fontStyle,
			x,
			y,
			width,
			text,
		} = props
		scene.load.image('button-blue', 'assets/ui/Outline/blue.png')
		scene.load.image('button-red', 'assets/ui/Outline/red.png')

		this.image = scene.add
			.nineslice(x, y, texture || 'button-blue')
			.setSize(width, height)
		this.label = scene.add.text(x, y, text || '', fontStyle).setOrigin(0.5)

		this.image.setInteractive()

		this.image.on('pointerover', () => {
			this.image.setTexture(imageHover || 'button-red')
		})

		this.image.on('pointerout', () => {
			this.image.setTexture('button-blue')
		})
		this.image.on('pointerdown', () => {
			this.image.setTint(0xff66ff)
		})
		this.image.on('pointerup', () => {
			this.image.setTint(0xffffff)
			onClick()
		})
	}
}
