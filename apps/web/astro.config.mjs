// @ts-check
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://alcolmeter.kr',
  trailingSlash: 'never',
  integrations: [mdx(), sitemap()],
});
