<script lang="ts">
	import type { TermVideo } from './terms';

	let { video }: { video: TermVideo } = $props();

	// 썸네일·임베드 URL은 영상 id에서 파생한다.
	// 쇼츠 세로(9:16) 썸네일은 oardefault(Original Aspect Ratio). 비공식 URL이라 maxresdefault로 폴백.
	const thumbUrl = $derived(`https://i.ytimg.com/vi/${video.id}/oardefault.jpg`);
	const fallbackThumbUrl = $derived(`https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`);
	const embedUrl = $derived(`https://www.youtube.com/embed/${video.id}?autoplay=1`);
	const watchUrl = $derived(`https://www.youtube.com/shorts/${video.id}`);

	// Lite 파사드: 클릭 전까지 YouTube iframe(스크립트)을 로드하지 않는다.
	let playing = $state(false);

	function handleThumbError(event: Event) {
		const img = event.currentTarget as HTMLImageElement;
		if (!img.src.endsWith('/maxresdefault.jpg')) img.src = fallbackThumbUrl;
	}
</script>

<figure class="term-video">
	<div class="frame">
		{#if playing}
			<iframe
				src={embedUrl}
				title={video.title}
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				allowfullscreen
			></iframe>
		{:else}
			<button
				type="button"
				class="play"
				onclick={() => (playing = true)}
				aria-label={`영상 재생: ${video.title}`}
			>
				<img
					src={thumbUrl}
					alt={video.title}
					width="1080"
					height="1920"
					loading="lazy"
					onerror={handleThumbError}
				/>
				<span class="play-icon" aria-hidden="true"></span>
			</button>
		{/if}
	</div>
	<figcaption>
		<a href={watchUrl} target="_blank" rel="noopener noreferrer">{video.title}</a>
	</figcaption>
</figure>

<style>
	.term-video {
		width: 100%;
		max-width: 320px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: var(--ds-space-sm);
	}

	.frame {
		position: relative;
		width: 100%;
		aspect-ratio: 9 / 16;
		overflow: hidden;
		border-radius: var(--ds-radius-md);
		background: var(--ds-color-surface);
		border: var(--ds-border-width) solid var(--ds-color-border-2);
	}

	.frame iframe,
	.frame .play {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		border: 0;
	}

	.play {
		display: grid;
		place-items: center;
		padding: 0;
		background: none;
		cursor: pointer;
	}

	.play img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	/* 재생 삼각형: spark 원형 위 흰 삼각형 */
	.play-icon {
		position: relative;
		width: 3.25rem;
		height: 3.25rem;
		border-radius: var(--ds-radius-full);
		background: var(--ds-color-spark);
		box-shadow: 0 4px 16px rgb(0 0 0 / 0.25);
		transition:
			transform var(--ds-duration-short) var(--ds-ease-out),
			background var(--ds-duration-short) var(--ds-ease-out);
	}

	.play-icon::after {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-40%, -50%);
		border-style: solid;
		border-width: 0.5rem 0 0.5rem 0.85rem;
		border-color: transparent transparent transparent var(--ds-color-on-accent);
	}

	.play:hover .play-icon,
	.play:focus-visible .play-icon {
		transform: scale(1.08);
		background: var(--ds-color-spark-hover);
	}

	figcaption {
		text-align: center;
		font-size: var(--ds-text-xs);
	}

	figcaption a {
		color: var(--ds-color-ink-3);
		text-decoration: none;
		border-bottom: 1px solid var(--ds-color-border-3);
		transition: color var(--ds-duration-short) var(--ds-ease-out);
	}

	figcaption a:hover {
		color: var(--ds-color-spark);
	}
</style>
