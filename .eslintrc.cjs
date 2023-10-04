module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	root: true,
	ignorePatterns: ['.eslintrc.js'],
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
	overrides: [],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		project: 'tsconfig.json',
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint'],
	rules: {
		'@typescript-eslint/ban-ts-ignore': 'off',
		'@typescript-eslint/member-delimiter-style': 'off',
		'@typescript-eslint/interface-name-prefix': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'prettier/prettier': ['error', { 'endOfLine': 'lf' }],
		'@typescript-eslint/ban-ts-comment': 'off',
		'semi': ['error', 'never'],
		'@typescript-eslint/no-unused-vars': ['warn']
	},
}
