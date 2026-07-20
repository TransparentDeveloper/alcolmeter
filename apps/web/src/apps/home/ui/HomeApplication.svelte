<script lang="ts">
	import { MetaHead } from '$shared/ui';
	import { HomePage } from '$pages/home/ui';
	import type { PostListItem } from '$entities/post/model';
	import type { WikiTermData } from '$entities/wiki/model';

	let { posts, terms }: { posts: PostListItem[]; terms: WikiTermData[] } = $props();
</script>

<MetaHead
	title="알콜미터 - 양조 커뮤니티"
	description="집에서 술 빚는 사람들의 커뮤니티. 양조 기록과 후기, 질문을 나누고 알콜위키로 용어를 익히며 배합 계산기로 비율을 잡습니다."
	path="/"
	image="/og/home.png"
/>

<HomePage {posts} {terms} />
