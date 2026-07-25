<script lang="ts">
	import { WikiHistoryApplication } from '$apps/wiki/ui';
	let { data } = $props();
</script>

<WikiHistoryApplication term={data.term} history={data.history} authorId={data.authorId} />
