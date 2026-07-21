<script lang="ts">
	import type { WikiTermData } from '$entities/wiki/model';

	let { terms }: { terms: WikiTermData[] } = $props();
</script>

<section class="section">
	<div class="section-head">
		<h2 class="section-title">알콜위키</h2>
		{#if terms.length > 0}<a class="more" href="/wiki">더 보기 →</a>{/if}
	</div>
	<p class="section-desc">양조 용어를 한곳에 모아 함께 채워가요.</p>

	{#if terms.length === 0}
		<p class="empty-desc">아직 등록된 용어가 없어요.</p>
	{:else}
		<div class="list">
			{#each terms as t (t.id)}
				<a class="row" href={`/wiki/${encodeURIComponent(t.slug)}`}>
					<span class="title">{t.title}</span>
					<span class="cat">{t.category}</span>
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

	/* 한 줄 행 — 위키: 제목 + 카테고리 (게시일 없음) */
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
	.cat {
		flex: none;
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-4);
	}
	.empty-desc {
		font-size: var(--ds-text-sm);
		color: var(--ds-color-ink-3);
	}
</style>
