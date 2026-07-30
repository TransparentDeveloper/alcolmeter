<script lang="ts">
	import { Prose } from '$shared/ui';

	let { bodyHtml }: { bodyHtml: string } = $props();

	let container: HTMLDivElement | undefined = $state();

	// 본문(.wiki-video 파사드)은 {@html} 정적 마크업이라 Svelte 반응성이 닿지 않는다.
	// 클릭 시 직접 DOM을 조작해 앵커를 youtube-nocookie iframe으로 바꾼다(점진적 향상, No-JS엔 링크 그대로).
	$effect(() => {
		bodyHtml; // bodyHtml이 바뀌면 새 마크업에 다시 바인딩
		if (typeof document === 'undefined' || !container) return;

		const anchors = container.querySelectorAll<HTMLAnchorElement>('a.wiki-video');
		const cleanups: (() => void)[] = [];

		anchors.forEach((anchor) => {
			function onClick(event: MouseEvent) {
				event.preventDefault();
				const id = new URL(anchor.href).searchParams.get('v');
				if (!id) return;

				const iframe = document.createElement('iframe');
				iframe.className = 'wiki-video-frame';
				iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
				iframe.title = anchor.querySelector('img')?.alt ?? '영상 재생';
				iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
				iframe.allowFullscreen = true;
				iframe.loading = 'lazy';

				anchor.replaceWith(iframe);
			}
			anchor.addEventListener('click', onClick);
			cleanups.push(() => anchor.removeEventListener('click', onClick));
		});

		return () => cleanups.forEach((cleanup) => cleanup());
	});
</script>

<!-- 공통 타이포는 shared/ui/Prose가 담당하고, 여기서는 위키 고유 요소(본문 인라인 영상)만 얹는다 -->
<div class="wiki-body" bind:this={container}>
	<Prose html={bodyHtml} />
</div>

<style>
	/* 본문 인라인 영상(::youtube) 파사드 */
	.wiki-body :global(.wiki-video) {
		display: block;
		max-width: 320px;
		margin: var(--ds-space-lg) auto;
	}

	.wiki-body :global(.wiki-video img) {
		width: 100%;
		border-radius: var(--ds-radius-md);
	}

	/* 클릭 후 파사드 자리에 삽입되는 인-페이지 재생 iframe */
	.wiki-body :global(.wiki-video-frame) {
		display: block;
		width: 100%;
		max-width: 480px;
		aspect-ratio: 16 / 9;
		margin: var(--ds-space-lg) auto;
		border: none;
		border-radius: var(--ds-radius-md);
		overflow: hidden;
	}
</style>
