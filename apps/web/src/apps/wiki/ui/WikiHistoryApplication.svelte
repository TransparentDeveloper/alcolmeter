<script lang="ts">
	import { MetaHead } from '$shared/ui';
	import { WikiHistoryPage } from '$pages/wiki/ui';
	import type { WikiTermData, WikiRevisionData } from '$entities/wiki/model';

	let {
		term,
		history,
		authorId
	}: { term: WikiTermData; history: WikiRevisionData[]; authorId: string } = $props();
</script>

<MetaHead
	title="{term.title} 편집 이력 - 알콜위키 - 알콜미터"
	description="{term.title} 문서의 편집 이력입니다."
	path="/wiki/{encodeURIComponent(term.slug)}/history"
	noindex
/>

<WikiHistoryPage {term} {history} {authorId} />
