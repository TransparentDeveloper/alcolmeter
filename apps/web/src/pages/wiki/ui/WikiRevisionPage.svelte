<script lang="ts">
	import { WikiRevisionView } from '$widgets/wiki/ui';
	import type { WikiRevisionData } from '$entities/wiki/model';

	let { slug, revision, bodyHtml }: { slug: string; revision: WikiRevisionData; bodyHtml: string } = $props();
</script>

<svelte:head>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<WikiRevisionView {slug} {revision} {bodyHtml} />
