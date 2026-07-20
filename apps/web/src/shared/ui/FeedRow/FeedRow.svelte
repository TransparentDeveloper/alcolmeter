<script lang="ts">
	// 한 줄 목록 행 (DC 갤러리형). 박스 없이 제목 + 메타(작성자·날짜 / 카테고리·날짜)를 한 줄에.
	// 행 사이는 하단 괘선(border-1)으로만 구분한다.
	let {
		href,
		title,
		metaLeft,
		metaRight
	}: {
		href: string;
		title: string;
		metaLeft: string;
		metaRight: string;
	} = $props();
</script>

<a {href} class="feed-row">
	<span class="title">{title}</span>
	<span class="meta">
		<span class="meta-left">{metaLeft}</span>
		<span class="meta-right">{metaRight}</span>
	</span>
</a>

<style>
	.feed-row {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--ds-space-md);
		padding: var(--ds-space-sm) var(--ds-space-xs);
		border-bottom: var(--ds-border-width) solid var(--ds-color-border-1);
		text-decoration: none;
		color: var(--ds-color-ink-1);
		transition: background-color var(--ds-duration-short) var(--ds-ease-out);
	}
	.feed-row:hover {
		background: var(--ds-color-hover);
	}
	.title {
		flex: 1;
		min-width: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-size: var(--ds-text-base);
		color: var(--ds-color-ink-1);
		transition: color var(--ds-duration-short) var(--ds-ease-out);
	}
	.feed-row:hover .title {
		color: var(--ds-color-spark);
	}
	.meta {
		display: flex;
		align-items: baseline;
		gap: var(--ds-space-md);
		flex: none;
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-3);
	}
	.meta-left {
		color: var(--ds-color-ink-4);
	}
</style>
