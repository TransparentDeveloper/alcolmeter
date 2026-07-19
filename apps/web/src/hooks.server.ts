import { redirect, type Handle } from '@sveltejs/kit';

// 구 용어사전 주소를 알콜위키로 영구 이전
const handle: Handle = async ({ event, resolve }) => {
	const { pathname } = event.url;
	if (pathname === '/dictionary') throw redirect(301, '/wiki');
	if (pathname.startsWith('/dictionary/')) throw redirect(301, `/wiki/${pathname.slice('/dictionary/'.length)}`);
	return resolve(event);
};

export { handle };
