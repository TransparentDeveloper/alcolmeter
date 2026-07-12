<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { AuthAPI } from '$features/auth/api';
	import { authStore } from '$features/auth/store/index.svelte';

	let email = $state('');
	let password = $state('');
	let oauthError = $state<string | null>(null);

	const redirectTo = $derived(page.url.searchParams.get('redirect') ?? '/blog');

	// 이미 로그인 상태로 로그인 페이지에 오면 목적지로 보낸다.
	$effect(() => {
		if (authStore.value.status === 'signedIn') goto(redirectTo);
	});

	onMount(() => {
		const search = new URLSearchParams(window.location.search);
		const hash = new URLSearchParams(window.location.hash.slice(1));
		oauthError =
			search.get('error_description') ??
			search.get('error') ??
			hash.get('error_description') ??
			hash.get('error');
	});

	async function signInWithGoogle() {
		authStore.set({ ...authStore.value, error: null });
		const back = `${location.origin}/login?redirect=${encodeURIComponent(redirectTo)}`;
		const { error } = await AuthAPI.signInWithOAuth('google', back);
		if (error) authStore.set({ ...authStore.value, error: error.message });
	}

	async function signIn() {
		authStore.set({ ...authStore.value, error: null });
		const { error } = await AuthAPI.signInWithPassword(email, password);
		if (error) authStore.set({ ...authStore.value, error: error.message });
	}

	async function signUp() {
		authStore.set({ ...authStore.value, error: null });
		const { error } = await AuthAPI.signUp(email, password);
		if (error) authStore.set({ ...authStore.value, error: error.message });
	}
</script>

<section>
	<form onsubmit={(e) => e.preventDefault()}>
		<input type="email" bind:value={email} placeholder="이메일" autocomplete="email" />
		<input
			type="password"
			bind:value={password}
			placeholder="비밀번호"
			autocomplete="current-password"
		/>
		<div class="row">
			<button type="submit" onclick={signIn}>로그인</button>
			<button type="button" onclick={signUp}>가입</button>
		</div>
	</form>
	<button type="button" class="google" onclick={signInWithGoogle}>Google로 계속</button>

	{#if authStore.value.error}
		<p role="alert">{authStore.value.error}</p>
	{/if}
	{#if oauthError}
		<p role="alert">{oauthError}</p>
	{/if}
</section>

<style>
	section {
		display: grid;
		gap: var(--ds-space-md);
		max-width: 20rem;
	}
	form {
		display: grid;
		gap: var(--ds-space-sm);
	}
	.row {
		display: flex;
		gap: var(--ds-space-sm);
	}
	input,
	button {
		font: inherit;
		padding: var(--ds-space-sm) var(--ds-space-md);
	}
	p[role='alert'] {
		color: var(--ds-color-spark);
		font-size: var(--ds-text-sm);
	}
</style>
