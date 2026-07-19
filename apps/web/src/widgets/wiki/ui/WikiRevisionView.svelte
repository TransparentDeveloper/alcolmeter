<script lang="ts">
	import type { WikiRevisionData } from '$entities/wiki/model';
	import WikiBody from './WikiBody.svelte';

	let { slug, revision, bodyHtml }: { slug: string; revision: WikiRevisionData; bodyHtml: string } = $props();
</script>

<article>
	<p class="banner">
		이 버전은 과거 스냅샷입니다 · <a href="/wiki/{encodeURIComponent(slug)}">현재 버전 보기</a>
	</p>

	<h1>{revision.title}</h1>
	<p class="summary">{revision.summary}</p>

	<WikiBody {bodyHtml} />
</article>

<style>
	.banner {
		margin: 0 0 var(--ds-space-lg);
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
</style>
