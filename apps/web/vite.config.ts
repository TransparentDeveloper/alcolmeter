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
	// sanitize-html(CJS)이 htmlparser2 v12(ESM 전용)를 require()하는데, Vercel 서버리스 런타임은
	// require(ESM)을 금지(ERR_REQUIRE_ESM)한다. 서버 번들에 함께 넣어 빌드 타임에 해소한다.
	ssr: {
		noExternal: ['sanitize-html', 'htmlparser2'],
		// dev(vite) SSR에서도 CJS→ESM interop을 강제한다. noExternal만으로는 module-runner가
		// sanitize-html(CJS)의 require()를 해소하지 못해 'require is not defined'가 난다.
		optimizeDeps: {
			include: ['sanitize-html', 'htmlparser2']
		}
	},
	define: {
		__APP_VERSION__: JSON.stringify(pkg.version),
		__FAVICON_VERSION__: JSON.stringify(faviconVersion)
	},
	test: {
		include: ['src/**/*.test.ts']
	}
});
