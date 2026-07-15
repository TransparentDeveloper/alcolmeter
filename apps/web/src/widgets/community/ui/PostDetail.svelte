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
		goto('/community');
	}
</script>

<article>
	<header>
		<h1>{post.title}</h1>
		<span class="meta">{post.author.displayName} · {post.createdAt.slice(0, 10)}</span>
		{#if isOwner}
			<div class="actions">
				<a href={`/community/${post.id}/edit`}>수정</a>
				<button type="button" onclick={remove}>삭제</button>
			</div>
		{/if}
	</header>

	{#each post.blocks as block (block.id)}
		<section>
			{#each block.elements as element (element.id)}
				{#if element.type === 'heading'}
					<h2>{element.value}</h2>
				{:else if element.type === 'body'}
					<p>{element.value}</p>
				{:else if element.type === 'image'}
					<img src={element.value} alt="" />
				{/if}
			{/each}
		</section>
	{/each}
</article>

<style>
	article {
		max-width: 44rem;
		margin: 0 auto;
		display: grid;
		gap: var(--ds-space-2xl);
	}
	h1 {
		font-family: var(--ds-font-display);
		font-size: var(--ds-text-3xl);
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
	section {
		display: grid;
		gap: var(--ds-space-md);
	}
	section h2 {
		font-family: var(--ds-font-display);
		font-size: var(--ds-text-2xl);
		margin: 0;
	}
	section p {
		white-space: pre-wrap;
		margin: 0;
		line-height: var(--ds-leading-normal);
		color: var(--ds-color-ink-1);
	}
	section img {
		max-width: 100%;
		height: auto;
		border-radius: var(--ds-radius-md);
	}
</style>
