<script lang="ts">
	let { bodyHtml }: { bodyHtml: string } = $props();
</script>

<div class="body">{@html bodyHtml}</div>

<style>
	/* 본문(마크다운 렌더 결과)은 {@html}이라 :global 필요. 옛 용어사전 TermBody의 prose 스타일을 이관.
	   WikiDetail(현재 버전)·WikiRevisionView(과거 스냅샷)가 공유한다. */
	.body {
		font-size: var(--ds-text-sm);
		line-height: 1.85;
		color: var(--ds-color-ink-2);
	}

	.body :global(h2) {
		font-family: var(--ds-font-display);
		font-size: var(--ds-text-lg);
		font-weight: var(--ds-weight-bold);
		letter-spacing: var(--ds-tracking-tight);
		color: var(--ds-color-ink-1);
		margin: var(--ds-space-xl) 0 var(--ds-space-sm);
	}

	.body :global(p) {
		margin: var(--ds-space-md) 0;
	}

	.body :global(ul) {
		margin: var(--ds-space-md) 0;
		padding-left: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: var(--ds-space-xs);
	}

	.body :global(strong) {
		font-weight: var(--ds-weight-bold);
		color: var(--ds-color-ink-1);
	}

	.body :global(blockquote) {
		margin: var(--ds-space-lg) 0;
		padding: var(--ds-space-md) var(--ds-space-lg);
		background: var(--ds-color-spark-tint);
		border-left: 3px solid var(--ds-color-spark);
		border-radius: var(--ds-radius-sm);
		color: var(--ds-color-ink-1);
		font-size: var(--ds-text-sm);
	}

	.body :global(blockquote p) {
		margin: 0;
	}

	.body :global(table) {
		width: 100%;
		border-collapse: collapse;
		margin: var(--ds-space-lg) 0;
		font-size: var(--ds-text-xs);
	}

	.body :global(th),
	.body :global(td) {
		text-align: left;
		padding: var(--ds-space-sm) var(--ds-space-md);
		border-bottom: var(--ds-border-width) solid var(--ds-color-border-2);
	}

	.body :global(th) {
		font-family: var(--ds-font-mono);
		color: var(--ds-color-ink-3);
		font-weight: var(--ds-weight-medium);
	}

	/* 위키링크 */
	.body :global(.wiki-link) {
		color: var(--ds-color-action);
		text-decoration: none;
		border-bottom: 1px solid var(--ds-color-border-3);
		transition: border-color var(--ds-duration-short) var(--ds-ease-out);
	}

	.body :global(.wiki-link:hover) {
		border-bottom-color: var(--ds-color-action);
	}

	.body :global(.wiki-link--missing) {
		color: var(--ds-color-ink-4);
		border-bottom: 1px dashed var(--ds-color-border-2);
		cursor: help;
	}

	.body :global(img) {
		max-width: 100%;
		height: auto;
	}

	/* 본문 인라인 영상(::youtube) 파사드 */
	.body :global(.wiki-video) {
		display: inline-block;
		max-width: 320px;
	}

	.body :global(.wiki-video img) {
		width: 100%;
		border-radius: var(--ds-radius-md);
	}
</style>
