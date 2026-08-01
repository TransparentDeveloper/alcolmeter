import { redirect, type Handle } from '@sveltejs/kit';

// 구 주소를 새 주소로 영구 이전(색인·북마크 보존)
const handle: Handle = async ({ event, resolve }) => {
	const { pathname } = event.url;
	if (pathname === '/dictionary') throw redirect(301, '/wiki');
	if (pathname.startsWith('/dictionary/')) throw redirect(301, `/wiki/${pathname.slice('/dictionary/'.length)}`);
	if (pathname === '/makgeolli') throw redirect(301, '/calculate-makgeolli');
	// 알콜위키 이용 안내는 편집 규칙·신고 절차가 운영정책으로 흡수되며 폐지됐다
	if (pathname === '/wiki/guidelines') throw redirect(301, '/policy');
	return resolve(event);
};

export { handle };
