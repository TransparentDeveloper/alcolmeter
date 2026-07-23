<script lang="ts">
	import { slide } from 'svelte/transition';
	import type { WikiTermData } from '$entities/wiki/model';
	import { videoWatchUrl } from '$entities/wiki/lib';
	import WikiVideo from './WikiVideo.svelte';

	let { term }: { term: WikiTermData } = $props();

	// 영상 설명 펼침(단방향). 한 번 열면 닫지 않는다.
	let videoExpanded = $state(false);

	// 같은 key 값을 콤마로 분해해 모은다. 표시 순서: 동의어 → 참고링크 → 일반행.
	function collect(key: 'alternateName' | 'sameAs'): string[] {
		const values = term.infoRows
			.filter((r) => r.key === key)
			.flatMap((r) => r.value.split(/[\n,]/))
			.map((s) => s.trim())
			.filter(Boolean);
		return [...new Set(values)]; // 동일 값은 하나만
	}
	const altNames = $derived(collect('alternateName'));
	const refUrls = $derived(collect('sameAs'));
	const textRows = $derived(term.infoRows.filter((r) => r.key === 'text'));

	const hasContent = $derived(
		!!term.mainImage || !!term.video || term.infoRows.length > 0
	);
</script>

{#if hasContent}
	<aside class="infobox" aria-label="{term.title} 정보">
		<dl>
			{#if term.mainImage}
				<div class="row row--media">
					<dt>대표 이미지</dt>
					<dd class="media">
						<div class="media-body">
							<img src={term.mainImage.url} alt={term.mainImage.alt || term.title} />
						</div>
						{#if term.mainImage.alt}<p class="media-caption">{term.mainImage.alt}</p>{/if}
					</dd>
				</div>
			{/if}
			{#if term.video}
				<div class="row row--media">
					<dt>대표 영상</dt>
					<dd class="media">
						<div class="media-body"><WikiVideo video={term.video} /></div>
						<div class="video-cap">
							<div class="video-cap-head">
								<a
									class="video-cap-title"
									href={videoWatchUrl(term.video)}
									target="_blank"
									rel="nofollow noopener">{term.video.title || '영상 보기'}</a
								>
								{#if term.video.description && !videoExpanded}
									<button type="button" class="video-more" onclick={() => (videoExpanded = true)}>
										더보기
									</button>
								{/if}
							</div>
							{#if videoExpanded}
								<div class="video-cap-detail" transition:slide={{ duration: 150 }}>
									<p class="video-desc">{term.video.description}</p>
								</div>
							{/if}
						</div>
					</dd>
				</div>
			{/if}
			{#if altNames.length}
				<div class="row">
					<dt>다른 이름</dt>
					<dd class="alt-names">
						{#each altNames as name, j (j)}<span class="alt-name">{name}</span>{/each}
					</dd>
				</div>
			{/if}
			{#if refUrls.length}
				<div class="row">
					<dt>참고 링크</dt>
					<dd>
						<ul class="ref-list">
							{#each refUrls as url, j (j)}
								<li><a href={url} target="_blank" rel="nofollow noopener">{url}</a></li>
							{/each}
						</ul>
					</dd>
				</div>
			{/if}
			{#each textRows as r, i (`text-${i}`)}
				<div class="row"><dt>{r.label}</dt><dd>{r.value}</dd></div>
			{/each}
		</dl>
	</aside>
{/if}

<style>
	.infobox {
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		border-radius: var(--ds-radius-md);
		overflow: hidden;
	}
	dl {
		margin: 0;
	}
	.row {
		display: grid;
		grid-template-columns: 9.5rem minmax(0, 1fr);
		border-bottom: var(--ds-border-width) solid var(--ds-color-border-1);
	}
	.row:last-child {
		border-bottom: none;
	}
	dt {
		padding: var(--ds-space-sm) var(--ds-space-md);
		background: var(--ds-color-hover);
		border-right: var(--ds-border-width) solid var(--ds-color-border-1);
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-xs);
		font-weight: var(--ds-weight-medium);
		color: var(--ds-color-ink-3);
	}
	dd {
		margin: 0;
		padding: var(--ds-space-sm) var(--ds-space-md);
		font-size: var(--ds-text-sm);
		color: var(--ds-color-ink-1);
		min-width: 0;
	}
	dd a {
		color: var(--ds-color-action);
		text-decoration: none;
		word-break: break-all;
	}
	dd a:hover {
		text-decoration: underline;
	}

	/* 다른 이름: chip 토큰(비링크, 스캔용) */
	.alt-names {
		display: flex;
		flex-wrap: wrap;
		gap: var(--ds-space-xs);
	}
	.alt-name {
		display: inline-block;
		padding: var(--ds-space-2xs) var(--ds-space-sm);
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		border-radius: var(--ds-radius-full);
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-2);
	}

	/* 참고 링크: 한 줄씩 목록, 긴 URL은 말줄임(ellipsis) */
	.ref-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--ds-space-2xs);
	}
	.ref-list li {
		min-width: 0;
	}
	.ref-list a {
		display: block;
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: var(--ds-text-xs);
		color: var(--ds-color-action);
		text-decoration: none;
	}
	.ref-list a:hover {
		text-decoration: underline;
	}

	/* 미디어 셀: 이미지·영상 가운데 + 설명 행(구분선) */
	dd.media {
		padding: 0;
	}
	.media-body {
		display: flex;
		justify-content: center;
		padding: var(--ds-space-md);
	}
	.media-caption {
		margin: 0;
		padding: var(--ds-space-2xs) var(--ds-space-md);
		border-top: var(--ds-border-width) solid var(--ds-color-border-1);
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-3);
		text-align: left;
		word-break: break-all;
	}

	/* 영상 설명: 제목(유튜브 링크) + 우측 더보기 → 펼치면 설명 */
	.video-cap {
		border-top: var(--ds-border-width) solid var(--ds-color-border-1);
	}
	.video-cap-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--ds-space-sm);
		padding: var(--ds-space-2xs) var(--ds-space-md);
	}
	.video-cap-title {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: var(--ds-text-xs);
		color: var(--ds-color-action);
		text-decoration: none;
	}
	.video-cap-title:hover {
		text-decoration: underline;
	}
	.video-more {
		flex: none;
		font: inherit;
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-4);
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		transition: color var(--ds-duration-short) var(--ds-ease-out);
	}
	.video-more:hover {
		color: var(--ds-color-ink-2);
	}
	.video-cap-detail {
		padding: 0 var(--ds-space-md) var(--ds-space-sm);
	}
	.video-desc {
		margin: 0;
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-4);
		white-space: pre-line;
	}

	.infobox img {
		display: block;
		max-width: min(100%, 480px);
		height: auto;
		border-radius: var(--ds-radius-sm);
	}
</style>
