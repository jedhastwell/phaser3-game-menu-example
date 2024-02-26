// List of all levels with associated data. Could add all sorts of data points in here. The map is just an example.

export interface ILevel {
	name: string
	map: string
}

const levels = [] as ILevel[]

for (let i = 1; i <= 50; i++) {
	levels.push({ name: 'Level ' + i, map: 'level-' + i })
}
export default levels
