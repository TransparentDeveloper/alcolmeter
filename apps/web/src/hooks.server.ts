import { redirect, type Handle } from '@sveltejs/kit';

// 구 주소를 새 주소로 영구 이전(색인·북마크 보존)
const handle: Handle = async ({ event, resolve }) => {
	const { pathname } = event.url;
	if (pathname === '/dictionary') throw redirect(301, '/wiki');
	if (pathname.startsWith('/dictionary/')) throw redirect(301, `/wiki/${pathname.slice('/dictionary/'.length)}`);
	if (pathname === '/makgeolli') throw redirect(301, '/calculate-makgeolli');
	return resolve(event);
};

export { handle };
