import Phaser from 'phaser'

export interface IGameState {
	maxUnlockedLevel: number
}

const GameStateDefaults: IGameState = {
	maxUnlockedLevel: 0,
}

class GameState extends Phaser.Events.EventEmitter {
	constructor(
		private defaults: IGameState = GameStateDefaults,
		private _data: IGameState,
	) {
		super()
		this.defaults = GameStateDefaults
		this._data = {
			maxUnlockedLevel: defaults.maxUnlockedLevel,
		}
		this.load()
	}

	// Loads previously saved game state from local storage.
	load() {
		const saveData = JSON.parse(
			localStorage.getItem('save-data') || JSON.stringify(GameStateDefaults),
		)
		if (saveData) {
			this._data = saveData
		}
	}

	// Saves current game state to local storage.
	save() {
		localStorage.setItem('save-data', JSON.stringify(this._data))
	}

	// Clears previously saved game state from local storage
	clearSavedData() {
		localStorage.clear()
	}

	maxUnlockedLevel() {
		return this._data.maxUnlockedLevel
	}

	completeLevel(levelIndex: number) {
		this._data.maxUnlockedLevel = Math.max(
			this._data.maxUnlockedLevel,
			levelIndex + 1,
		)
		this.save()
	}
}

const gameState = new GameState(GameStateDefaults, GameStateDefaults)

export default gameState
