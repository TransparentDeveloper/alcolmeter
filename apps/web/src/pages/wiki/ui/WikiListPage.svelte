<script lang="ts">
	import type { WikiTermData } from '$entities/wiki/model';
	import { WikiList } from '$widgets/wiki/ui';
	let { terms }: { terms: WikiTermData[] } = $props();
</script>

<WikiList {terms} />
