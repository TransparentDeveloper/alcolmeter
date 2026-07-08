<script lang="ts">
	import type { PageData } from './$types';
	import { TermApplication } from '$apps/term/ui';

	let { data }: { data: PageData } = $props();
</script>

<TermApplication meta={data.meta} content={data.component} related={data.related} />
