import { page } from '$app/state';
import { AuthAPI } from '$features/auth/api';
import { authStore } from '$features/auth/store/index.svelte';

/** 로그인 폼의 뷰 상태·액션: 입력값·OAuth 에러·로그인/구글 로그인·리다이렉트 목적지. */
class LoginFormView {
	email = $state('');
	password = $state('');
	oauthError = $state<string | null>(null);

	redirectTo = $derived(page.url.searchParams.get('redirect') ?? '/community');

	get isSignedIn(): boolean {
		return authStore.value.status === 'signedIn';
	}

	get error(): string | null {
		return authStore.value.error;
	}

	/** OAuth 콜백 URL(쿼리·해시)에서 에러 메시지를 읽어 담는다. 브라우저에서만 호출한다. */
	readOAuthError(): void {
		const search = new URLSearchParams(window.location.search);
		const hash = new URLSearchParams(window.location.hash.slice(1));
		this.oauthError =
			search.get('error_description') ??
			search.get('error') ??
			hash.get('error_description') ??
			hash.get('error');
	}

	async signIn(): Promise<void> {
		authStore.set({ ...authStore.value, error: null });
		const { error } = await AuthAPI.signInWithPassword(this.email, this.password);
		if (error) authStore.set({ ...authStore.value, error: error.message });
	}

	async signInWithGoogle(): Promise<void> {
		authStore.set({ ...authStore.value, error: null });
		const back = `${location.origin}/login?redirect=${encodeURIComponent(this.redirectTo)}`;
		const { error } = await AuthAPI.signInWithOAuth('google', back);
		if (error) authStore.set({ ...authStore.value, error: error.message });
	}
}

export { LoginFormView };
