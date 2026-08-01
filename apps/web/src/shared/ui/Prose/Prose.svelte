<script lang="ts">
	// 마크다운 렌더 결과(HTML 문자열)의 공통 타이포. 위키·커뮤니티 본문이 공유한다.
	let { html }: { html: string } = $props();
</script>

<div class="prose">{@html html}</div>

<style>
	/* 본문(마크다운 렌더 결과)은 {@html}이라 :global 필요 */
	.prose {
		font-size: var(--ds-type-body);
		line-height: var(--ds-leading-normal);
		color: var(--ds-color-ink-2);
	}

	.prose :global(h2) {
		font-family: var(--ds-font-display);
		font-size: var(--ds-type-h2);
		font-weight: var(--ds-weight-bold);
		letter-spacing: var(--ds-tracking-tight);
		color: var(--ds-color-ink-1);
		margin: var(--ds-space-xl) 0 var(--ds-space-sm);
	}

	.prose :global(p) {
		margin: var(--ds-space-md) 0;
	}

	.prose :global(h3) {
		font-family: var(--ds-font-display);
		font-size: var(--ds-type-h3);
		font-weight: var(--ds-weight-bold);
		letter-spacing: var(--ds-tracking-tight);
		color: var(--ds-color-ink-1);
		margin: var(--ds-space-lg) 0 var(--ds-space-sm);
	}

	.prose :global(h4) {
		font-family: var(--ds-font-display);
		font-size: var(--ds-type-h4);
		font-weight: var(--ds-weight-bold);
		letter-spacing: var(--ds-tracking-tight);
		color: var(--ds-color-ink-1);
		margin: var(--ds-space-lg) 0 var(--ds-space-sm);
	}

	.prose :global(ul),
	.prose :global(ol) {
		margin: var(--ds-space-md) 0;
		padding-left: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: var(--ds-space-xs);
	}
	/* 중첩 목록: 부모 li와 한 덩어리로 보이게 상하 마진 제거 */
	.prose :global(ul ul),
	.prose :global(ul ol),
	.prose :global(ol ul),
	.prose :global(ol ol) {
		margin: 0;
	}

	.prose :global(hr) {
		margin: var(--ds-space-lg) 0;
		border: none;
		border-top: var(--ds-border-width) solid var(--ds-color-border-2);
	}

	.prose :global(strong) {
		font-weight: var(--ds-weight-bold);
		color: var(--ds-color-ink-1);
	}

	.prose :global(blockquote) {
		margin: var(--ds-space-lg) 0;
		padding: var(--ds-space-md) var(--ds-space-lg);
		background: var(--ds-color-spark-tint);
		border-left: 3px solid var(--ds-color-spark);
		border-radius: var(--ds-radius-sm);
		color: var(--ds-color-ink-1);
		/* 틴트 배경과 왼쪽 스파크 선이 이미 강조를 맡으므로 크기는 본문과 같이 둔다 */
		font-size: var(--ds-type-body);
	}

	.prose :global(blockquote p) {
		margin: 0;
	}

	.prose :global(table) {
		width: 100%;
		/* 편집 화면과 같은 열 폭 계산을 쓴다: 여기서 auto면 내용 길이에 따라 열이 재배분돼
		   글쓴이가 편집 중에 본 표와 독자가 보는 표의 폭이 어긋난다 */
		table-layout: fixed;
		border-collapse: collapse;
		margin: var(--ds-space-lg) 0;
		font-size: var(--ds-type-body);
	}

	.prose :global(th),
	.prose :global(td) {
		text-align: left;
		padding: var(--ds-space-sm) var(--ds-space-md);
		border-bottom: var(--ds-border-width) solid var(--ds-color-border-2);
		overflow-wrap: break-word;
	}

	.prose :global(th) {
		font-family: var(--ds-font-mono);
		color: var(--ds-color-ink-3);
		font-weight: var(--ds-weight-medium);
	}

	/* 위키링크 (커뮤니티 본문도 같은 렌더러를 쓰므로 공통) */
	.prose :global(.wiki-link) {
		color: var(--ds-color-action);
		text-decoration: none;
		border-bottom: 1px solid var(--ds-color-border-3);
		transition: border-color var(--ds-duration-short) var(--ds-ease-out);
	}

	.prose :global(.wiki-link:hover) {
		border-bottom-color: var(--ds-color-action);
	}

	.prose :global(.wiki-link--missing) {
		color: var(--ds-color-ink-4);
		border-bottom: 1px dashed var(--ds-color-border-2);
		cursor: help;
	}

	.prose :global(img) {
		max-width: 100%;
		height: auto;
	}
</style>
