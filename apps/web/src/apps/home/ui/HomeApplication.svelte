<script lang="ts">
	import { MetaHead } from '$shared/ui';
	import { HomePage } from '$pages/home/ui';
	import type { PostListItem } from '$entities/post/model';
	import type { WikiTermData } from '$entities/wiki/model';

	let { posts, terms }: { posts: PostListItem[]; terms: WikiTermData[] } = $props();
</script>

<MetaHead
	title="알콜미터 - 술을 빚는 사람과 즐기는 사람의 커뮤니티"
	description="술을 빚는 사람과 즐기는 사람이 모이는 커뮤니티. 양조 기록과 후기를 나누고, 알콜위키로 용어를 익히고, 계산기로 배합과 도수를 잡습니다."
	path="/"
	image="/og/home.png"
/>

<HomePage {posts} {terms} />
