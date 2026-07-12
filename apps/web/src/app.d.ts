// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	const __APP_VERSION__: string;
	const __FAVICON_VERSION__: string;
	// Google Analytics 전역. app.html의 gtag.js 스니펫이 정의한다.
	function gtag(...args: unknown[]): void;

	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
