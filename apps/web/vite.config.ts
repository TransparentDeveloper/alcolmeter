import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { readFileSync } from 'fs';
import { createHash } from 'crypto';

const pkg = JSON.parse(readFileSync('package.json', 'utf-8'));

// 파비콘 파일 내용 해시 → 캐시 버스팅 쿼리(`?v=`). 파일이 바뀔 때만 값이 바뀐다.
const faviconVersion = createHash('sha256')
	.update(readFileSync('static/favicon.svg'))
	.digest('hex')
	.slice(0, 8);

export default defineConfig({
	plugins: [sveltekit()],
	define: {
		__APP_VERSION__: JSON.stringify(pkg.version),
		__FAVICON_VERSION__: JSON.stringify(faviconVersion)
	},
	test: {
		include: ['../../tests/**/*.test.ts']
	}
});
