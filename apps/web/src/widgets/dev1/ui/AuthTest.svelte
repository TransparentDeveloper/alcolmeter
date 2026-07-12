<script lang="ts">
	import { onMount } from 'svelte';
	import { UserModel } from '$entities/user/model';
	import { AuthAPI } from '$features/auth/api';
	import { authStore } from '$features/auth/store/index.svelte';

	let email = $state('');
	let password = $state('');
	// OAuth 복귀 시 프로바이더 거부 등은 세션 이벤트가 아니라 URL 쿼리/해시로 실려 온다.
	let oauthError = $state<string | null>(null);

	onMount(() => {
		// 세션 변화를 store에 반영한다 (store는 상태만 담으므로 조합은 여기 view에서 한다).
		const { data } = AuthAPI.onAuthStateChange((_event, session) => {
			authStore.set(
				session?.user
					? { user: UserModel.fromSupabaseUser(session.user), status: 'signedIn', error: null }
					: { user: null, status: 'signedOut', error: null }
			);
		});

		const search = new URLSearchParams(window.location.search);
		const hash = new URLSearchParams(window.location.hash.slice(1));
		oauthError =
			search.get('error_description') ??
			search.get('error') ??
			hash.get('error_description') ??
			hash.get('error');

		return () => data.subscription.unsubscribe();
	});

	async function signInWithGoogle() {
		authStore.set({ ...authStore.value, error: null });
		const redirectTo = `${location.origin}${location.pathname}`;
		const { error } = await AuthAPI.signInWithOAuth('google', redirectTo);
		if (error) authStore.set({ ...authStore.value, error: error.message });
	}

	async function signUp() {
		authStore.set({ ...authStore.value, error: null });
		const { error } = await AuthAPI.signUp(email, password);
		if (error) authStore.set({ ...authStore.value, error: error.message });
	}

	async function signIn() {
		authStore.set({ ...authStore.value, error: null });
		const { error } = await AuthAPI.signInWithPassword(email, password);
		if (error) authStore.set({ ...authStore.value, error: error.message });
	}

	async function signOut() {
		authStore.set({ ...authStore.value, error: null });
		const { error } = await AuthAPI.signOut();
		if (error) authStore.set({ ...authStore.value, error: error.message });
	}
</script>

<section>
	<h2>인증</h2>
	<p>status: <strong>{authStore.value.status}</strong></p>

	{#if authStore.value.user}
		<ul>
			<li>id: {authStore.value.user.id}</li>
			<li>name: {authStore.value.user.name}</li>
			<li>email: {authStore.value.user.email}</li>
			<li>provider: {authStore.value.user.provider}</li>
		</ul>
		{#if authStore.value.user.avatarUrl}
			<img src={authStore.value.user.avatarUrl} alt="avatar" width="48" height="48" />
		{/if}
		<button onclick={signOut}>로그아웃</button>
	{:else}
		<form onsubmit={(e) => e.preventDefault()}>
			<input type="email" bind:value={email} placeholder="이메일" autocomplete="email" />
			<input
				type="password"
				bind:value={password}
				placeholder="비밀번호"
				autocomplete="current-password"
			/>
			<div class="row">
				<button type="submit" onclick={signIn}>이메일 로그인</button>
				<button type="button" onclick={signUp}>이메일 가입</button>
			</div>
		</form>
		<button type="button" onclick={signInWithGoogle}>Google 로그인</button>
	{/if}

	{#if authStore.value.error}
		<p role="alert">에러: {authStore.value.error}</p>
	{/if}
	{#if oauthError}
		<p role="alert">OAuth 에러: {oauthError}</p>
	{/if}
</section>

<style>
	section {
		display: grid;
		gap: 0.75rem;
		justify-items: start;
	}
	form {
		display: grid;
		gap: 0.5rem;
	}
	.row {
		display: flex;
		gap: 0.5rem;
	}
</style>
