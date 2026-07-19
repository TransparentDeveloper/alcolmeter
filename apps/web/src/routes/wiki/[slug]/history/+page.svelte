<script lang="ts">
	import { WikiHistoryPage } from '$pages/wiki/ui';
	let { data } = $props();
</script>
<WikiHistoryPage term={data.term} history={data.history} authorId={data.authorId} />
