<script lang="ts">
	import type { WikiTermData } from '$entities/wiki/model';
	import { formatDate } from '$shared/lib';
	import WikiBody from './WikiBody.svelte';
	import WikiInfobox from './WikiInfobox.svelte';
	let { term, bodyHtml }: { term: WikiTermData; bodyHtml: string } = $props();
</script>

<article>
	<p class="meta">
		마지막 수정 {formatDate(term.updatedAt)} ·
		<a href="/wiki/{encodeURIComponent(term.slug)}/history">편집 이력</a> ·
		<a href="/wiki/{encodeURIComponent(term.slug)}/edit">수정</a>
	</p>

	<header>
		<h1>{term.title}</h1>
		{#if term.summary}<p class="summary">{term.summary}</p>{/if}
	</header>

	<WikiInfobox {term} />

	<WikiBody {bodyHtml} />
</article>

<style>
	article {
		display: grid;
		gap: var(--ds-space-lg);
	}
	header {
		display: grid;
		gap: var(--ds-space-sm);
	}
	h1 {
		font-family: var(--ds-font-display);
		font-size: var(--ds-text-3xl);
		letter-spacing: var(--ds-tracking-tight);
		margin: 0;
	}
	.summary {
		font-size: var(--ds-text-base);
		color: var(--ds-color-ink-2);
		margin: 0;
	}
	.meta {
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-3);
		text-align: right;
	}
	.meta a {
		color: inherit;
		text-decoration: none;
	}
	.meta a:hover {
		color: var(--ds-color-ink-1);
	}
</style>
