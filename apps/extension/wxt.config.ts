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
		version: '0.1.3'
	}
});
