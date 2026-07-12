<script lang="ts">
	import { PostModel } from '$entities/post/model';
	import type { PostData } from '$entities/post/model';
	import { PostDetail } from '$widgets/blog/ui';

	let { post }: { post: PostData } = $props();

	const model = $derived(new PostModel(post));
</script>

<PostDetail post={model} />
