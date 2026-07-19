<script lang="ts">
	import type { WikiTermData } from '$entities/wiki/model';
	import { videoThumbnails, videoWatchUrl } from '$entities/wiki/lib';
	import WikiBody from './WikiBody.svelte';
	let { term, bodyHtml, related }: { term: WikiTermData; bodyHtml: string; related: { slug: string; title: string }[] } = $props();
</script>

<article>
	<h1>{term.title}</h1>
	<p class="summary">{term.summary}</p>

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
			<ul>{#each related as r (r.slug)}<li><a href="/wiki/{encodeURIComponent(r.slug)}">{r.title}</a></li>{/each}</ul>
		</nav>
	{/if}

	<p class="meta"><a href="/wiki/{encodeURIComponent(term.slug)}/history">편집 이력</a> · <a href="/wiki/{encodeURIComponent(term.slug)}/edit">수정</a></p>
</article>
