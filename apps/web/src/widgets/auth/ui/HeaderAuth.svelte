<script lang="ts">
	import { onMount } from 'svelte';
	import { UserModel } from '$entities/user/model';
	import { UserAPI } from '$entities/user/api';
	import { AuthAPI } from '$features/auth/api';
	import { authStore } from '$features/auth/store/index.svelte';

	onMount(() => {
		const { data } = AuthAPI.onAuthStateChange((_event, session) => {
			if (session?.user) {
				const user = UserModel.fromSupabaseUser(session.user);
				authStore.set({ user, status: 'signedIn', error: null });
				// 로그인 시 공개 프로필을 최신으로 맞춘다 (실패해도 UI를 막지 않는다).
				void UserAPI.upsertProfile(user);
			} else {
				authStore.set({ user: null, status: 'signedOut', error: null });
			}
		});
		return () => data.subscription.unsubscribe();
	});

	async function signOut() {
		await AuthAPI.signOut();
	}
</script>

{#if authStore.value.status === 'signedIn' && authStore.value.user}
	<span class="auth">
		<span class="name">{authStore.value.user.displayName}</span>
		<button type="button" onclick={signOut}>로그아웃</button>
	</span>
{:else if authStore.value.status === 'signedOut'}
	<a class="auth" href="/login">로그인</a>
{/if}

<style>
	.auth {
		display: inline-flex;
		align-items: center;
		gap: var(--ds-space-sm);
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-3);
		text-decoration: none;
	}
	.name {
		color: var(--ds-color-ink-1);
	}
	button {
		font: inherit;
		color: var(--ds-color-ink-3);
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
	}
	button:hover {
		color: var(--ds-color-spark);
	}
</style>
