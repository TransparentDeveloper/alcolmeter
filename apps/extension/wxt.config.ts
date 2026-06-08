import { defineConfig } from 'wxt';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

export default defineConfig({
	vite: () => ({
		plugins: [svelte()],
		define: {
			__APP_VERSION__: JSON.stringify(pkg.version)
		}
	}),
	manifest: {
		name: 'Alcolmeter',
		description: '막걸리 배합 계산기',
		version: '0.1.5',
		icons: {
			16: 'icon-16.png',
			32: 'icon-32.png',
			48: 'icon-48.png',
			128: 'icon-128.png'
		},
		action: {
			default_icon: {
				16: 'icon-16.png',
				32: 'icon-32.png',
				48: 'icon-48.png',
				128: 'icon-128.png'
			}
		}
	}
});
