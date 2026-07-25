<script lang="ts">
	import { MetaHead } from '$shared/ui';
	import { CommunityListPage } from '$pages/community/ui';
	import type { PostData } from '$entities/post/model';

	let { posts }: { posts: PostData[] } = $props();
</script>

<MetaHead
	title="커뮤니티 - 알콜미터"
	description="술을 빚고 즐기는 사람들이 남긴 양조 기록과 후기, 질문. 막걸리·전통주부터 사이다까지 함께 이야기합니다."
	path="/community"
	image="/og/community.png"
/>

<CommunityListPage {posts} />
