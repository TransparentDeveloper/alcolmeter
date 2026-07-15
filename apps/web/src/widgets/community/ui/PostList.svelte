<script lang="ts">
	import type { PostModel } from '$entities/post/model';

	let { posts }: { posts: PostModel[] } = $props();
</script>

{#if posts.length === 0}
	<p class="empty">아직 글이 없어요. 첫 글을 남겨보세요.</p>
{:else}
	<ul>
		{#each posts as post (post.id)}
			<li>
				<a href={`/community/${post.id}`}>
					<h2>{post.title}</h2>
					<p class="summary">{post.summary}</p>
					<span class="meta">{post.author.displayName} · {post.createdAt.slice(0, 10)}</span>
				</a>
			</li>
		{/each}
	</ul>
{/if}

<style>
	ul {
		list-style: none;
		padding: 0;
		display: grid;
		gap: var(--ds-space-lg);
	}
	a {
		display: grid;
		gap: var(--ds-space-xs);
		text-decoration: none;
		color: inherit;
		padding-bottom: var(--ds-space-lg);
		border-bottom: var(--ds-border-width) solid var(--ds-color-border-1);
	}
	h2 {
		font-family: var(--ds-font-display);
		font-size: var(--ds-text-lg);
		color: var(--ds-color-ink-1);
		margin: 0;
	}
	.summary {
		color: var(--ds-color-ink-2);
		margin: 0;
	}
	.meta {
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-3);
	}
	.empty {
		color: var(--ds-color-ink-3);
	}
</style>
