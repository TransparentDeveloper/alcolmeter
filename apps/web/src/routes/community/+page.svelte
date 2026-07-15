<script lang="ts">
	import { CommunityListApplication } from '$apps/community/ui';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<CommunityListApplication posts={data.posts} />
