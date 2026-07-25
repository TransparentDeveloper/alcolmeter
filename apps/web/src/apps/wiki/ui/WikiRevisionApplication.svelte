<script lang="ts">
	import { MetaHead } from '$shared/ui';
	import { WikiRevisionPage } from '$pages/wiki/ui';
	import type { WikiRevisionData } from '$entities/wiki/model';

	let { slug, revision, bodyHtml }: { slug: string; revision: WikiRevisionData; bodyHtml: string } =
		$props();
</script>

<MetaHead
	title="{revision.title} 편집 이력 - 알콜위키 - 알콜미터"
	description="{revision.title} 문서의 지난 판입니다."
	path="/wiki/{encodeURIComponent(slug)}/history/{revision.id}"
	noindex
/>

<WikiRevisionPage {slug} {revision} {bodyHtml} />
