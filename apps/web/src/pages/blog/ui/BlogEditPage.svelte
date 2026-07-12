<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { PostEditor, PostEditorState } from '$widgets/blog/ui';
	import { PostAPI } from '$entities/post/api';
	import { Supabase } from '$shared/supabase/api';
	import { authStore } from '$features/auth/store/index.svelte';

	const id = Number(page.params.id);

	let editor = $state<PostEditorState | null>(null);
	let saving = $state(false);
	let errorMessage = $state<string | null>(null);
	let loaded = $state(false);

	// 상태 확정 후: 비로그인 → 로그인, 로그인 → 글을 불러와 소유권 확인.
	$effect(() => {
		const { status, user } = authStore.value;
		if (status === 'loading' || loaded) return;
		if (status === 'signedOut' || !user) {
			goto(`/login?redirect=/blog/${id}/edit`);
			return;
		}
		loaded = true;
		void load(user.id);
	});

	async function load(userId: string) {
		const post = await PostAPI.getById(Supabase.getClient(), id);
		if (!post) {
			goto('/blog');
			return;
		}
		if (post.author.id !== userId) {
			goto(`/blog/${id}`);
			return;
		}
		editor = new PostEditorState({ title: post.title, blocks: post.blocks });
	}

	async function submit() {
		if (!editor || !editor.isValid || saving) return;
		saving = true;
		errorMessage = null;
		try {
			await PostAPI.update(Supabase.getClient(), id, editor.toInput());
			goto(`/blog/${id}`);
		} catch (e) {
			errorMessage = e instanceof Error ? e.message : '저장에 실패했어요.';
			saving = false;
		}
	}
</script>

<main>
	<h1>글 수정</h1>
	{#if editor}
		<PostEditor {editor} submitLabel={saving ? '저장 중…' : '수정 완료'} onsubmit={submit} />
		{#if errorMessage}<p role="alert">{errorMessage}</p>{/if}
	{:else}
		<p class="loading">불러오는 중…</p>
	{/if}
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
	.loading,
	p[role='alert'] {
		max-width: 44rem;
		margin: 0 auto;
		width: 100%;
		color: var(--ds-color-ink-3);
	}
	p[role='alert'] {
		color: var(--ds-color-spark);
	}
</style>
