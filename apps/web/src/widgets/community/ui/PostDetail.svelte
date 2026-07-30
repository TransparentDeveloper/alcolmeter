<script lang="ts">
	import { Prose } from '$shared/ui';
	import { formatDate } from '$shared/lib';
	import type { PostModel } from '$entities/post/model';
	import { authStore } from '$features/auth/store/index.svelte';

	let {
		post,
		bodyHtml,
		ondelete
	}: { post: PostModel; bodyHtml: string; ondelete: () => void } = $props();

	const isOwner = $derived(authStore.value.user?.id === post.author.id);
	const edited = $derived(post.updatedAt !== post.createdAt);
</script>

<article>
	<header>
		<h1>{post.title}</h1>
		<div class="meta">
			<span>{post.author.displayName}</span>
			<span>{formatDate(post.createdAt)}</span>
			{#if edited}<span>수정 {formatDate(post.updatedAt)}</span>{/if}
		</div>
		{#if isOwner}
			<div class="actions">
				<a href={`/community/${post.id}/edit`}>수정</a>
				<button type="button" onclick={ondelete}>삭제</button>
			</div>
		{/if}
	</header>

	<Prose html={bodyHtml} />

	<footer>
		<a href="/community">← 커뮤니티 목록</a>
	</footer>
</article>

<style>
	article {
		display: grid;
		gap: var(--ds-space-2xl);
	}
	h1 {
		font-family: var(--ds-font-display);
		font-size: var(--ds-text-3xl);
		letter-spacing: var(--ds-tracking-tight);
		margin: 0 0 var(--ds-space-sm);
	}
	.meta {
		display: flex;
		gap: var(--ds-space-md);
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
		transition: color var(--ds-duration-short) var(--ds-ease-out);
	}
	.actions a:hover {
		color: var(--ds-color-ink-1);
	}
	.actions button:hover {
		color: var(--ds-color-error);
	}
	footer {
		border-top: var(--ds-border-width) solid var(--ds-color-border-1);
		padding-top: var(--ds-space-lg);
	}
	footer a {
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-3);
		text-decoration: none;
		transition: color var(--ds-duration-short) var(--ds-ease-out);
	}
	footer a:hover {
		color: var(--ds-color-spark);
	}
</style>
