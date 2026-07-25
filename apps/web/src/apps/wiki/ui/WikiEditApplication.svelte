<script lang="ts">
	import { MetaHead } from '$shared/ui';
	import { WikiEditPage } from '$pages/wiki/ui';

	let { slug }: { slug: string } = $props();
</script>

<MetaHead
	title="{slug} 수정 - 알콜위키 - 알콜미터"
	description="알콜위키 용어를 수정합니다."
	path="/wiki/{encodeURIComponent(slug)}/edit"
	noindex
/>

<WikiEditPage {slug} />
