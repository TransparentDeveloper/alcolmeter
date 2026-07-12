<script lang="ts">
	import { goto } from '$app/navigation';
	import { PostEditor, PostEditorState } from '$widgets/blog/ui';
	import { PostAPI } from '$entities/post/api';
	import { UserAPI } from '$entities/user/api';
	import { Supabase } from '$shared/supabase/api';
	import { authStore } from '$features/auth/store/index.svelte';

	const editor = new PostEditorState();
	let saving = $state(false);
	let errorMessage = $state<string | null>(null);

	// 로그인 가드: 상태가 확정된 뒤 비로그인이면 로그인으로 보낸다.
	$effect(() => {
		if (authStore.value.status === 'signedOut') {
			goto('/login?redirect=/blog/new');
		}
	});

	async function submit() {
		const user = authStore.value.user;
		if (!user || !editor.isValid || saving) return;
		saving = true;
		errorMessage = null;
		try {
			const client = Supabase.getClient();
			// author_id → profiles.id FK를 만족시키려 프로필을 먼저 보장한다.
			await UserAPI.upsertProfile(user);
			const id = await PostAPI.create(client, user.id, editor.toInput());
			goto(`/blog/${id}`);
		} catch (e) {
			errorMessage = e instanceof Error ? e.message : '저장에 실패했어요.';
			saving = false;
		}
	}
</script>

<main>
	<h1>글쓰기</h1>
	<PostEditor {editor} submitLabel={saving ? '저장 중…' : '발행'} onsubmit={submit} />
	{#if errorMessage}<p role="alert">{errorMessage}</p>{/if}
</main>

<style>
	main {
		display: grid;
		gap: var(--ds-space-lg);
	}
	h1 {
		max-width: 44rem;
		margin: 0 auto;
		width: 100%;
		font-family: var(--ds-font-display);
	}
	p[role='alert'] {
		max-width: 44rem;
		margin: 0 auto;
		width: 100%;
		color: var(--ds-color-spark);
	}
</style>
