<script lang="ts">
	import type { WikiTermData } from '$entities/wiki/model';
	import { videoThumbnails, videoWatchUrl } from '$entities/wiki/lib';
	import WikiBody from './WikiBody.svelte';
	let {
		term,
		bodyHtml,
		related
	}: { term: WikiTermData; bodyHtml: string; related: { slug: string; title: string }[] } =
		$props();
</script>

<article>
	<header>
		{#if term.category}<p class="eyebrow">{term.category}</p>{/if}
		<h1>{term.title}</h1>
		<p class="summary">{term.summary}</p>
	</header>

	{#if term.mainImage}<img class="main" src={term.mainImage} alt={term.title} />{/if}

	{#if term.video}
		{@const thumbs = videoThumbnails(term.video)}
		<a class="video" href={videoWatchUrl(term.video)}>
			<img src={thumbs[0]} alt={term.video.title} />
		</a>
	{/if}

	<WikiBody {bodyHtml} />

	{#if related.length}
		<nav class="related">
			<h2>관련 용어</h2>
			<ul>
				{#each related as r (r.slug)}
					<li><a href="/wiki/{encodeURIComponent(r.slug)}">{r.title}</a></li>
				{/each}
			</ul>
		</nav>
	{/if}

	<p class="meta">
		<a href="/wiki/{encodeURIComponent(term.slug)}/history">편집 이력</a> ·
		<a href="/wiki/{encodeURIComponent(term.slug)}/edit">수정</a>
	</p>
</article>

<style>
	article {
		max-width: 44rem;
		margin: 0 auto;
		display: grid;
		gap: var(--ds-space-2xl);
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
	.main {
		max-width: 100%;
		height: auto;
		border-radius: var(--ds-radius-md);
	}
	.video {
		display: inline-block;
		max-width: 320px;
		justify-self: center;
	}
	.video img {
		width: 100%;
		border-radius: var(--ds-radius-md);
	}
	.related h2 {
		font-family: var(--ds-font-display);
		font-size: var(--ds-text-base);
		font-weight: var(--ds-weight-semibold);
		color: var(--ds-color-ink-1);
		margin: 0 0 var(--ds-space-sm);
	}
	.related ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: var(--ds-space-sm);
	}
	.related a {
		display: inline-block;
		font-size: var(--ds-text-xs);
		font-weight: var(--ds-weight-medium);
		color: var(--ds-color-ink-2);
		text-decoration: none;
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		border-radius: var(--ds-radius-full);
		padding: var(--ds-space-2xs) var(--ds-space-md);
		transition:
			border-color var(--ds-duration-short) var(--ds-ease-out),
			color var(--ds-duration-short) var(--ds-ease-out);
	}
	.related a:hover {
		border-color: var(--ds-color-border-3);
		color: var(--ds-color-ink-1);
	}
	.meta {
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-3);
	}
	.meta a {
		color: inherit;
		text-decoration: none;
	}
</style>
