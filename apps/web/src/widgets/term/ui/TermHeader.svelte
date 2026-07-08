<script lang="ts">
	import type { TermMeta } from '$entities/dictionary/model';
	import { buildFeedbackUrl } from '$entities/dictionary/lib';

	let { meta }: { meta: TermMeta } = $props();
</script>

<div class="term-top">
	<nav class="breadcrumb" aria-label="경로">
		<a href="/dictionary">용어사전</a>
		<span class="sep" aria-hidden="true">›</span>
		<span class="current">{meta.title}</span>
	</nav>
	<a
		class="feedback-btn"
		href={buildFeedbackUrl(meta.title)}
		target="_blank"
		rel="noopener noreferrer"
	>
		<span class="feedback-icon" aria-hidden="true">✎</span>
		수정요청
	</a>
</div>

<header class="term-header">
	<div class="tags">
		{#each meta.domain as d (d)}
			<span class="domain">{d}</span>
		{/each}
		<span class="category">{meta.category}</span>
	</div>
	<h1>{meta.title}</h1>
	<p class="summary">{meta.summary}</p>
</header>

<style>
	/* 상단 행: 브레드크럼(좌) + 수정요청(우) */
	.term-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--ds-space-md);
	}

	.breadcrumb {
		display: flex;
		align-items: center;
		gap: var(--ds-space-sm);
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-xs);
		min-width: 0;
	}

	.breadcrumb a {
		color: var(--ds-color-ink-3);
		text-decoration: none;
		transition: color var(--ds-duration-short) var(--ds-ease-out);
	}

	.breadcrumb a:hover {
		color: var(--ds-color-spark);
	}

	.breadcrumb .sep {
		color: var(--ds-color-ink-4);
	}

	.breadcrumb .current {
		color: var(--ds-color-ink-2);
	}

	/* 수정요청 — 저강조 외곽선 버튼 */
	.feedback-btn {
		flex-shrink: 0;
		display: inline-flex;
		align-items: center;
		gap: var(--ds-space-2xs);
		padding: var(--ds-space-2xs) var(--ds-space-md);
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-3);
		background: var(--ds-color-surface);
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		border-radius: var(--ds-radius-sm);
		text-decoration: none;
		transition:
			border-color var(--ds-duration-short) var(--ds-ease-out),
			color var(--ds-duration-short) var(--ds-ease-out);
	}

	.feedback-btn:hover {
		color: var(--ds-color-ink-1);
		border-color: var(--ds-color-border-3);
	}

	.feedback-icon {
		font-size: 0.9em;
	}

	/* Header */
	.term-header {
		display: flex;
		flex-direction: column;
		gap: var(--ds-space-sm);
		padding-bottom: var(--ds-space-lg);
		border-bottom: var(--ds-border-width) solid var(--ds-color-border-1);
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--ds-space-2xs);
	}

	.domain,
	.category {
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-xs);
		padding: var(--ds-space-2xs) var(--ds-space-sm);
		border-radius: var(--ds-radius-sm);
		border: var(--ds-border-width) solid transparent;
	}

	/* 도메인 = 강조 칩 (이 용어가 어떤 술 갈래에서 쓰이는지 한눈에) */
	.domain {
		color: var(--ds-color-ink-1);
		background: var(--ds-color-spark-tint);
		border-color: var(--ds-color-spark);
		font-weight: var(--ds-weight-medium);
	}

	/* 카테고리 = 보조 칩 */
	.category {
		color: var(--ds-color-ink-3);
		background: var(--ds-color-surface);
		border-color: var(--ds-color-border-2);
	}

	.term-header h1 {
		font-family: var(--ds-font-display);
		font-size: var(--ds-text-2xl);
		font-weight: var(--ds-weight-bold);
		letter-spacing: var(--ds-tracking-tight);
		color: var(--ds-color-ink-1);
	}

	.summary {
		font-size: var(--ds-text-md);
		line-height: 1.7;
		color: var(--ds-color-ink-2);
		font-weight: var(--ds-weight-medium);
	}
</style>
