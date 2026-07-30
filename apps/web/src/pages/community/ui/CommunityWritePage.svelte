<script lang="ts">
	import { goto } from '$app/navigation';
	import { PostForm, PostWriteState } from '$widgets/community/ui';
	import { authStore } from '$features/auth/store/index.svelte';

	const writeState = new PostWriteState();
	let errorMessage = $state<string | null>(null);

	// 로그인 가드: 상태가 확정된 뒤 비로그인이면 로그인으로 보낸다.
	$effect(() => {
		if (authStore.value.status === 'signedOut')
			goto('/login?redirect=/community/new', { replaceState: true });
	});

	async function submit() {
		const user = authStore.value.user;
		if (!user) return;
		errorMessage = null;
		try {
			const id = await writeState.submit(user);
			if (id !== null) goto(`/community/${id}`);
		} catch (e) {
			errorMessage = e instanceof Error ? e.message : '저장에 실패했어요.';
		}
	}
</script>

<main>
	<PostForm
		form={writeState.form}
		submitLabel={writeState.saving ? '저장 중…' : '발행'}
		onsubmit={submit}
	/>
	{#if errorMessage}<p role="alert">{errorMessage}</p>{/if}
</main>

<style>
	main {
		display: grid;
		gap: var(--ds-space-lg);
	}
	p[role='alert'] {
		margin: 0;
		color: var(--ds-color-error);
	}
</style>
