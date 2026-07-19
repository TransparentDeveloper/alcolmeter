<script lang="ts">
	import { WikiHistory } from '$widgets/wiki/ui';
	import type { WikiTermData, WikiRevisionData } from '$entities/wiki/model';

	let {
		term,
		history,
		authorId
	}: { term: WikiTermData; history: WikiRevisionData[]; authorId: string } = $props();
</script>

<svelte:head>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<main>
	<h1>{term.title} 편집 이력</h1>
	<WikiHistory slug={term.slug} {history} />
</main>

<style>
	main {
		display: grid;
		gap: var(--ds-space-lg);
	}
	h1 {
		font-family: var(--ds-font-display);
		font-size: var(--ds-text-xl);
		margin: 0;
	}
</style>
