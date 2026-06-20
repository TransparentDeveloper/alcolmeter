<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const Content = $derived(data.component);
	const meta = $derived(data.meta);
	const related = $derived(data.related);

	const canonicalUrl = $derived(`https://alcolmeter.kr/dictionary/${encodeURIComponent(meta.slug)}`);

	const jsonLd = $derived(
		JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'DefinedTerm',
			name: meta.title,
			description: meta.summary,
			inDefinedTermSet: 'https://alcolmeter.kr/dictionary',
			url: canonicalUrl
		})
	);
</script>

<svelte:head>
	<title>{meta.title} - 전통주 용어사전 - 알콜미터</title>
	<meta name="description" content={meta.summary} />
	<link rel="canonical" href={canonicalUrl} />
	{@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>

<article class="term">
	<nav class="breadcrumb" aria-label="경로">
		<a href="/dictionary">용어사전</a>
		<span class="sep" aria-hidden="true">›</span>
		<span class="current">{meta.title}</span>
	</nav>

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

	<div class="prose">
		<Content />
	</div>

	{#if related.length > 0}
		<aside class="related">
			<h2>관련 용어</h2>
			<ul>
				{#each related as term (term.slug)}
					<li>
						<a href="/dictionary/{term.slug}">
							<strong>{term.title}</strong>
							<span>{term.summary}</span>
						</a>
					</li>
				{/each}
			</ul>
		</aside>
	{/if}
</article>

<style>
	.term {
		display: flex;
		flex-direction: column;
		gap: var(--ds-space-xl);
		padding-bottom: 3rem;
	}

	/* Breadcrumb */
	.breadcrumb {
		display: flex;
		align-items: center;
		gap: var(--ds-space-sm);
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-xs);
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

	/* Prose (mdsvex 본문은 별도 컴포넌트라 :global 필요) */
	.prose {
		font-size: var(--ds-text-sm);
		line-height: 1.85;
		color: var(--ds-color-ink-2);
	}

	.prose :global(h2) {
		font-family: var(--ds-font-display);
		font-size: var(--ds-text-lg);
		font-weight: var(--ds-weight-bold);
		letter-spacing: var(--ds-tracking-tight);
		color: var(--ds-color-ink-1);
		margin: var(--ds-space-xl) 0 var(--ds-space-sm);
	}

	.prose :global(p) {
		margin: var(--ds-space-md) 0;
	}

	.prose :global(ul) {
		margin: var(--ds-space-md) 0;
		padding-left: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: var(--ds-space-xs);
	}

	.prose :global(strong) {
		font-weight: var(--ds-weight-bold);
		color: var(--ds-color-ink-1);
	}

	.prose :global(blockquote) {
		margin: var(--ds-space-lg) 0;
		padding: var(--ds-space-md) var(--ds-space-lg);
		background: var(--ds-color-spark-tint);
		border-left: 3px solid var(--ds-color-spark);
		border-radius: var(--ds-radius-sm);
		color: var(--ds-color-ink-1);
		font-size: var(--ds-text-sm);
	}

	.prose :global(blockquote p) {
		margin: 0;
	}

	.prose :global(table) {
		width: 100%;
		border-collapse: collapse;
		margin: var(--ds-space-lg) 0;
		font-size: var(--ds-text-xs);
	}

	.prose :global(th),
	.prose :global(td) {
		text-align: left;
		padding: var(--ds-space-sm) var(--ds-space-md);
		border-bottom: var(--ds-border-width) solid var(--ds-color-border-2);
	}

	.prose :global(th) {
		font-family: var(--ds-font-mono);
		color: var(--ds-color-ink-3);
		font-weight: var(--ds-weight-medium);
	}

	/* 위키링크 (본문 내부라 :global) */
	.prose :global(.wiki-link) {
		color: var(--ds-color-action);
		text-decoration: none;
		border-bottom: 1px solid var(--ds-color-border-3);
		transition: border-color var(--ds-duration-short) var(--ds-ease-out);
	}

	.prose :global(.wiki-link:hover) {
		border-bottom-color: var(--ds-color-action);
	}

	.prose :global(.wiki-link--missing) {
		color: var(--ds-color-ink-4);
		border-bottom: 1px dashed var(--ds-color-border-2);
		cursor: help;
	}

	/* Related */
	.related {
		border-top: var(--ds-border-width) solid var(--ds-color-border-1);
		padding-top: var(--ds-space-lg);
	}

	.related h2 {
		font-family: var(--ds-font-display);
		font-size: var(--ds-text-md);
		font-weight: var(--ds-weight-bold);
		color: var(--ds-color-ink-1);
		margin-bottom: var(--ds-space-md);
	}

	.related ul {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: var(--ds-space-sm);
	}

	.related a {
		display: flex;
		flex-direction: column;
		gap: var(--ds-space-2xs);
		padding: var(--ds-space-md);
		background: var(--ds-color-surface);
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		border-radius: var(--ds-radius-md);
		text-decoration: none;
		transition: border-color var(--ds-duration-short) var(--ds-ease-out);
	}

	.related a:hover {
		border-color: var(--ds-color-border-3);
	}

	.related a strong {
		font-size: var(--ds-text-sm);
		font-weight: var(--ds-weight-bold);
		color: var(--ds-color-ink-1);
	}

	.related a span {
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-3);
		line-height: 1.5;
	}
</style>
