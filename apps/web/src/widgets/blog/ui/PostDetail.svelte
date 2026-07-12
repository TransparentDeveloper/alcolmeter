<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PostModel } from '$entities/post/model';
	import { PostAPI } from '$entities/post/api';
	import { Supabase } from '$shared/supabase/api';
	import { authStore } from '$features/auth/store/index.svelte';

	let { post }: { post: PostModel } = $props();

	const isOwner = $derived(authStore.value.user?.id === post.author.id);

	async function remove() {
		if (!confirm('이 글을 삭제할까요?')) return;
		await PostAPI.remove(Supabase.getClient(), post.id);
		goto('/blog');
	}
</script>

<article>
	<header>
		<h1>{post.title}</h1>
		<span class="meta">{post.author.displayName} · {post.createdAt.slice(0, 10)}</span>
		{#if isOwner}
			<div class="actions">
				<a href={`/blog/${post.id}/edit`}>수정</a>
				<button type="button" onclick={remove}>삭제</button>
			</div>
		{/if}
	</header>

	{#each post.blocks as block (block.id)}
		<section>
			{#if block.heading}<h2>{block.heading}</h2>{/if}
			<p>{block.text}</p>
		</section>
	{/each}
</article>

<style>
	article {
		max-width: 44rem;
		margin: 0 auto;
		display: grid;
		gap: var(--ds-space-lg);
	}
	h1 {
		font-family: var(--ds-font-display);
		margin: 0 0 var(--ds-space-xs);
	}
	.meta {
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-3);
	}
	.actions {
		display: flex;
		gap: var(--ds-space-md);
		margin-top: var(--ds-space-sm);
		font-size: var(--ds-text-sm);
	}
	.actions a,
	.actions button {
		font: inherit;
		color: var(--ds-color-ink-3);
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
		text-decoration: none;
	}
	section h2 {
		font-family: var(--ds-font-display);
		font-size: var(--ds-text-md);
		margin: 0 0 var(--ds-space-xs);
	}
	section p {
		white-space: pre-wrap;
		margin: 0;
		color: var(--ds-color-ink-1);
	}
</style>
