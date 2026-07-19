import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexConfig = {
	extensions: ['.md']
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	kit: {
		adapter: adapter(),
		// FSD 레이어 alias. 상위→하위 단방향 import는 각 세그먼트 배럴을 경유한다.
		alias: {
			$apps: 'src/apps',
			$pages: 'src/pages',
			$widgets: 'src/widgets',
			$features: 'src/features',
			$entities: 'src/entities',
			$shared: 'src/shared'
		}
	},
	preprocess: [vitePreprocess(), mdsvex(mdsvexConfig)]
};

export default config;
