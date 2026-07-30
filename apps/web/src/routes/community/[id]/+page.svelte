<script lang="ts">
	import { CommunityDetailApplication } from '$apps/community/ui';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<CommunityDetailApplication post={data.post} bodyHtml={data.bodyHtml} />
