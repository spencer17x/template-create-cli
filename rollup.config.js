import typescript from '@rollup/plugin-typescript';
import path from 'path';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
	input: path.join(__dirname, './src/index.ts'),
	output: {
		dir: 'dist',
		format: 'cjs'
	},
	plugins: [
		nodeResolve(),
		typescript({
			exclude: 'node_modules/**',
			typescript: require('typescript')
		})
	]
};