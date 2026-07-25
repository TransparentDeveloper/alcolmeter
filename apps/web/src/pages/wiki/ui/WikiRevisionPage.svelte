<script lang="ts">
	import { WikiRevisionView } from '$widgets/wiki/ui';
	import type { WikiRevisionData } from '$entities/wiki/model';

	let { slug, revision, bodyHtml }: { slug: string; revision: WikiRevisionData; bodyHtml: string } = $props();
</script>

<WikiRevisionView {slug} {revision} {bodyHtml} />
