<script lang="ts">
	import { page } from '$app/state';
	import { MetaHead } from '$shared/ui';
	import { CommunityEditPage } from '$pages/community/ui';
</script>

<MetaHead
	title="글 수정 - 커뮤니티 - 알콜미터"
	description="알콜미터 커뮤니티의 글을 수정합니다."
	path={`/community/${page.params.id}/edit`}
	noindex
/>

<CommunityEditPage />
