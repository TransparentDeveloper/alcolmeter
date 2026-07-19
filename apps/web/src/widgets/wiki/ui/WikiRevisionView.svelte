<script lang="ts">
	import type { WikiRevisionData } from '$entities/wiki/model';
	import WikiBody from './WikiBody.svelte';

	let { slug, revision, bodyHtml }: { slug: string; revision: WikiRevisionData; bodyHtml: string } = $props();
</script>

<article>
	<p class="banner">
		이 버전은 과거 스냅샷입니다 · <a href="/wiki/{encodeURIComponent(slug)}">현재 버전 보기</a>
	</p>

	<header>
		{#if revision.category}<p class="eyebrow">{revision.category}</p>{/if}
		<h1>{revision.title}</h1>
		<p class="summary">{revision.summary}</p>
	</header>

	<WikiBody {bodyHtml} />
</article>

<style>
	article {
		max-width: 44rem;
		margin: 0 auto;
		display: grid;
		gap: var(--ds-space-2xl);
	}
	.banner {
		padding: var(--ds-space-sm) var(--ds-space-md);
		background: var(--ds-color-spark-tint);
		border-left: 3px solid var(--ds-color-spark);
		border-radius: var(--ds-radius-sm);
		font-size: var(--ds-text-sm);
		color: var(--ds-color-ink-2);
	}
	.banner a {
		color: var(--ds-color-action);
	}
	header {
		display: grid;
		gap: var(--ds-space-sm);
	}
	.eyebrow {
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-xs);
		font-weight: var(--ds-weight-medium);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ds-color-ink-3);
	}
	h1 {
		font-family: var(--ds-font-display);
		font-size: var(--ds-text-3xl);
		letter-spacing: var(--ds-tracking-tight);
		margin: 0;
	}
	.summary {
		font-size: var(--ds-text-lg);
		color: var(--ds-color-ink-2);
		margin: 0;
	}
</style>
