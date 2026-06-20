import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import { wikiLinkPreprocess } from './src/lib/dictionary/wiki-link-preprocess.js';

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexConfig = {
	extensions: ['.md']
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	kit: {
		adapter: adapter()
	},
	// wikiLinkPreprocess는 mdsvex보다 먼저 실행되어 `[[용어]]`를 raw HTML로 치환한다.
	preprocess: [wikiLinkPreprocess(), vitePreprocess(), mdsvex(mdsvexConfig)]
};

export default config;
