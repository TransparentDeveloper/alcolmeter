<script lang="ts">
	import type { WikiVideo } from '$entities/wiki/model';
	import { videoThumbnails, isPortraitVideo } from '$entities/wiki/lib';

	let { video }: { video: WikiVideo } = $props();

	let playing = $state(false);
	let thumbIndex = $state(0);

	const thumbs = $derived(videoThumbnails(video));
	const portrait = $derived(isPortraitVideo(video));

	function onThumbError() {
		if (thumbIndex < thumbs.length - 1) thumbIndex += 1;
	}
</script>

{#if playing}
	<iframe
		class="frame"
		class:portrait
		src="https://www.youtube-nocookie.com/embed/{video.id}?autoplay=1&rel=0"
		title={video.title}
		allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
		allowfullscreen
		loading="lazy"
	></iframe>
{:else}
	<button
		type="button"
		class="facade"
		class:portrait
		aria-label="영상 재생: {video.title}"
		onclick={() => (playing = true)}
	>
		<img src={thumbs[thumbIndex]} alt={video.title} onerror={onThumbError} />
		<span class="play" aria-hidden="true">▶</span>
	</button>
{/if}

<style>
	.facade,
	.frame {
		display: block;
		width: 100%;
		max-width: 480px;
		aspect-ratio: 16 / 9;
		margin: 0 auto;
		border-radius: var(--ds-radius-md);
		overflow: hidden;
	}
	.facade.portrait,
	.frame.portrait {
		max-width: 240px;
		aspect-ratio: 9 / 16;
	}
	.facade {
		position: relative;
		padding: 0;
		border: none;
		background: none;
		cursor: pointer;
	}
	.facade:focus-visible {
		outline: 2px solid var(--ds-color-focus);
		outline-offset: 2px;
	}
	.facade img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.play {
		position: absolute;
		inset: 0;
		margin: auto;
		width: 3rem;
		height: 3rem;
		display: flex;
		align-items: center;
		justify-content: center;
		padding-left: 2px; /* 삼각형 광학 중심 보정 */
		border-radius: var(--ds-radius-full);
		background: color-mix(in srgb, var(--ds-color-surface) 85%, transparent);
		box-shadow: var(--ds-shadow-raised);
		color: var(--ds-color-ink-1);
		font-size: var(--ds-text-lg);
		line-height: 1;
		transition:
			transform var(--ds-duration-short) var(--ds-ease-out),
			background var(--ds-duration-short) var(--ds-ease-out);
	}
	.facade:hover .play,
	.facade:focus-visible .play {
		transform: scale(1.06);
		background: var(--ds-color-surface);
	}
	.frame {
		border: none;
	}
</style>
