<script lang="ts">
	import {
		isPortraitVideo,
		videoThumbnails,
		videoWatchUrl,
		videoEmbedUrl,
		type TermVideo
	} from './terms';

	let { video }: { video: TermVideo } = $props();

	const portrait = $derived(isPortraitVideo(video));
	// [기본, 폴백] 썸네일. oardefault(쇼츠 세로)/maxresdefault는 비공식·결측 가능성이 있어 폴백을 둔다.
	const thumbs = $derived(videoThumbnails(video));
	const embedUrl = $derived(`${videoEmbedUrl(video)}?autoplay=1`);
	const watchUrl = $derived(videoWatchUrl(video));
	// CLS 방지용 고유비율(실제 비율은 CSS aspect-ratio가 잡지만 width/height 힌트로 둔다).
	const thumbWidth = $derived(portrait ? 1080 : 1280);
	const thumbHeight = $derived(portrait ? 1920 : 720);

	// Lite 파사드: 클릭 전까지 YouTube iframe(스크립트)을 로드하지 않는다.
	let playing = $state(false);
	let thumbFailed = $state(false);
	const thumbUrl = $derived(thumbFailed ? thumbs[1] : thumbs[0]);
</script>

<figure class="term-video" class:portrait class:landscape={!portrait}>
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
					width={thumbWidth}
					height={thumbHeight}
					loading="lazy"
					onerror={() => (thumbFailed = true)}
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
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: var(--ds-space-sm);
	}

	/* 쇼츠(세로 9:16)와 일반 영상(가로 16:9)의 폭·비율 */
	.term-video.portrait {
		max-width: 240px;
	}

	.term-video.landscape {
		max-width: 480px;
	}

	.term-video.portrait .frame {
		aspect-ratio: 9 / 16;
	}

	.term-video.landscape .frame {
		aspect-ratio: 16 / 9;
	}

	.frame {
		position: relative;
		width: 100%;
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
