<script lang="ts">
	import { formatDate } from '$shared/lib';
	import type { PostModel } from '$entities/post/model';

	let { posts }: { posts: PostModel[] } = $props();
</script>

{#if posts.length === 0}
	<div class="empty">
		<p class="empty-title">아직 첫 기록이 없어요.</p>
		<p class="empty-desc">당신의 첫 글이 이 커뮤니티의 시작이 됩니다.</p>
	</div>
{:else}
	<div class="board">
		<!-- 칸 이름은 데스크톱에서만 보인다 (모바일은 행이 2줄로 접힌다) -->
		<div class="head-row" aria-hidden="true">
			<span class="col-title">제목</span>
			<span class="col-author">작성자</span>
			<span class="col-date">날짜</span>
		</div>
		<ul>
			{#each posts as post (post.id)}
				<li>
					<a href={`/community/${post.id}`}>
						<span class="title">{post.title}</span>
						<span class="author">{post.author.displayName}</span>
						<span class="date">{formatDate(post.createdAt)}</span>
					</a>
				</li>
			{/each}
		</ul>
	</div>
{/if}

<style>
	.board {
		border-top: var(--ds-border-width) solid var(--ds-color-border-2);
	}

	/* 모바일: 제목 한 줄 + 메타 한 줄 */
	.head-row {
		display: none;
	}
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	a {
		display: grid;
		grid-template-areas:
			'title title'
			'author date';
		grid-template-columns: 1fr auto;
		gap: var(--ds-space-2xs) var(--ds-space-md);
		padding: var(--ds-space-md) var(--ds-space-xs);
		border-bottom: var(--ds-border-width) solid var(--ds-color-border-1);
		text-decoration: none;
		color: inherit;
		transition: background-color var(--ds-duration-short) var(--ds-ease-out);
	}
	a:hover {
		background: var(--ds-color-hover);
	}
	.title {
		grid-area: title;
		min-width: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-size: var(--ds-text-sm);
		color: var(--ds-color-ink-1);
		transition: color var(--ds-duration-short) var(--ds-ease-out);
	}
	a:hover .title {
		color: var(--ds-color-spark);
	}
	.author {
		grid-area: author;
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-4);
	}
	.date {
		grid-area: date;
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-3);
	}

	/* 데스크톱: 제목·작성자·날짜 3칸 정렬 + 칸 이름 행 */
	@media (min-width: 768px) {
		.head-row,
		a {
			display: grid;
			grid-template-areas: 'title author date';
			grid-template-columns: 1fr 10rem 6rem;
			gap: var(--ds-space-md);
			align-items: baseline;
			padding: var(--ds-space-sm) var(--ds-space-xs);
		}
		.head-row {
			border-bottom: var(--ds-border-width) solid var(--ds-color-border-1);
			font-family: var(--ds-font-mono);
			font-size: var(--ds-text-xs);
			color: var(--ds-color-ink-4);
		}
		.col-title {
			grid-area: title;
		}
		.col-author {
			grid-area: author;
		}
		.col-date {
			grid-area: date;
			text-align: right;
		}
		.date {
			text-align: right;
		}
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
		margin: 0;
		font-size: var(--ds-text-base);
		font-weight: var(--ds-weight-semibold);
		color: var(--ds-color-ink-1);
	}
	.empty-desc {
		margin: 0;
		font-size: var(--ds-text-sm);
		color: var(--ds-color-ink-3);
	}
</style>
