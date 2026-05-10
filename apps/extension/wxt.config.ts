import { defineConfig } from 'wxt';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
	vite: () => ({ plugins: [svelte()] }),
	manifest: {
		name: 'Alcolmeter',
		description: '막걸리 배합 계산기',
		version: '0.1.0'
	}
});
