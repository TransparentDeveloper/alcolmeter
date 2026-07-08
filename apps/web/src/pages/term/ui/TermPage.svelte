<script lang="ts">
	import type { TermMeta } from '$entities/dictionary/model';
	import type { Component } from 'svelte';
	import { TermHeader, TermVideo, TermBody, TermRelated } from '$widgets/term/ui';

	let { meta, content, related }: { meta: TermMeta; content: Component; related: TermMeta[] } =
		$props();
</script>

<article class="term">
	<TermHeader {meta} />
	{#if meta.video}
		<TermVideo video={meta.video} />
	{/if}
	<TermBody {content} />
	{#if related.length > 0}
		<TermRelated {related} />
	{/if}
</article>

<style>
	.term {
		display: flex;
		flex-direction: column;
		gap: var(--ds-space-xl);
		padding-bottom: 3rem;
	}
</style>
