import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
	base: '',
	plugins: [
		viteStaticCopy({
			targets: [
				{
					src: 'assets',
					dest: '.',
				},
			],
		}),
	],
	server: { host: '0.0.0.0', port: 8000 },
	clearScreen: false,
})
