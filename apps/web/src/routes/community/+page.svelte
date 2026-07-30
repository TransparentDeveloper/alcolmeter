<script lang="ts">
	import { CommunityListApplication } from '$apps/community/ui';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<CommunityListApplication
	posts={data.posts}
	page={data.page}
	hasPrev={data.hasPrev}
	hasNext={data.hasNext}
/>
