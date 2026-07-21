<script lang="ts">
	import { formatDate } from '$shared/lib';
	import type { PostListItem } from '$entities/post/model';

	let { posts }: { posts: PostListItem[] } = $props();
</script>

<section class="section">
	<div class="section-head">
		<h2 class="section-title">커뮤니티</h2>
		{#if posts.length > 0}<a class="more" href="/community">더 보기 →</a>{/if}
	</div>
	<p class="section-desc">직접 빚은 기록과 후기, 궁금증을 나눠요.</p>

	{#if posts.length === 0}
		<div class="empty">
			<p class="empty-title">아직 첫 기록이 없어요.</p>
			<p class="empty-desc">당신의 첫 글이 이 커뮤니티의 시작이 됩니다.</p>
			<a class="empty-cta" href="/community/new">첫 글 쓰기 →</a>
		</div>
	{:else}
		<div class="list">
			{#each posts as p (p.id)}
				<a class="row" href={`/community/${p.id}`}>
					<span class="title">{p.title}</span>
					<span class="meta">
						<span class="author">{p.authorName}</span>
						<span class="date">{formatDate(p.createdAt)}</span>
					</span>
				</a>
			{/each}
		</div>
	{/if}
</section>

<style>
	.section-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--ds-space-md);
		margin-bottom: var(--ds-space-2xs);
	}
	.section-title {
		font-family: var(--ds-font-display);
		font-size: var(--ds-text-lg);
		font-weight: var(--ds-weight-bold);
		letter-spacing: var(--ds-tracking-tight);
		color: var(--ds-color-ink-1);
	}
	.section-desc {
		font-size: var(--ds-text-sm);
		color: var(--ds-color-ink-3);
		margin-bottom: var(--ds-space-md);
	}
	.more {
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-3);
		text-decoration: none;
		flex: none;
		transition: color var(--ds-duration-short) var(--ds-ease-out);
	}
	.more:hover {
		color: var(--ds-color-spark);
	}
	.list {
		display: flex;
		flex-direction: column;
		border-top: var(--ds-border-width) solid var(--ds-color-border-1);
	}

	/* 한 줄 행 — 커뮤니티: 제목 + 작성자·게시일 */
	.row {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--ds-space-md);
		padding: var(--ds-space-sm) var(--ds-space-xs);
		border-bottom: var(--ds-border-width) solid var(--ds-color-border-1);
		text-decoration: none;
		color: var(--ds-color-ink-1);
		transition: background-color var(--ds-duration-short) var(--ds-ease-out);
	}
	.row:hover {
		background: var(--ds-color-hover);
	}
	.title {
		flex: 1;
		min-width: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-1);
		transition: color var(--ds-duration-short) var(--ds-ease-out);
	}
	.row:hover .title {
		color: var(--ds-color-spark);
	}
	.meta {
		display: flex;
		align-items: baseline;
		gap: var(--ds-space-md);
		flex: none;
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-3);
	}
	.author {
		color: var(--ds-color-ink-4);
	}

	.empty {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--ds-space-2xs);
		padding: var(--ds-space-2xl) var(--ds-space-lg);
		border: var(--ds-border-width) dashed var(--ds-color-border-3);
		border-radius: var(--ds-radius-md);
	}
	.empty-title {
		font-size: var(--ds-text-base);
		font-weight: var(--ds-weight-semibold);
		color: var(--ds-color-ink-1);
	}
	.empty-desc {
		font-size: var(--ds-text-sm);
		color: var(--ds-color-ink-3);
	}
	.empty-cta {
		margin-top: var(--ds-space-sm);
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-sm);
		color: var(--ds-color-spark);
		text-decoration: none;
		transition: color var(--ds-duration-short) var(--ds-ease-out);
	}
	.empty-cta:hover {
		color: var(--ds-color-spark-hover);
	}
</style>
