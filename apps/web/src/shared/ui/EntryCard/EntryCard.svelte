<script lang="ts">
	// 링크형 엔트리 카드: 제목 + 설명 + 화살표. 홈(Community/Wiki/Learn)·위키 랜딩이 공유한다.
	let {
		href,
		title,
		description,
		meta
	}: {
		href: string;
		title: string;
		description: string;
		/** 부가 메타 한 줄(예: 카테고리 · 수정일). mono·ink-3로 표시된다 */
		meta?: string;
	} = $props();
</script>

<a {href} class="entry-card">
	<span class="body">
		<span class="title">{title}</span>
		<span class="desc">{description}</span>
		{#if meta}<span class="meta">{meta}</span>{/if}
	</span>
	<span class="arrow">→</span>
</a>

<style>
	.entry-card {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--ds-space-md);
		padding: var(--ds-space-lg);
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		border-radius: var(--ds-radius-md);
		background: var(--ds-color-surface);
		text-decoration: none;
		color: var(--ds-color-ink-1);
		transition:
			border-color var(--ds-duration-short) var(--ds-ease-out),
			transform var(--ds-duration-short) var(--ds-ease-out);
	}
	.entry-card:hover {
		border-color: var(--ds-color-border-3);
		transform: translateY(-1px);
	}
	.body {
		display: flex;
		flex-direction: column;
		gap: var(--ds-space-2xs);
	}
	.title {
		font-size: var(--ds-text-base);
		font-weight: var(--ds-weight-semibold);
	}
	.desc {
		font-size: var(--ds-text-sm);
		color: var(--ds-color-ink-3);
	}
	.meta {
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-3);
	}
	.arrow {
		font-size: var(--ds-text-lg);
		color: var(--ds-color-ink-3);
		flex: none;
		transition:
			transform var(--ds-duration-short) var(--ds-ease-out),
			color var(--ds-duration-short) var(--ds-ease-out);
	}
	.entry-card:hover .arrow {
		transform: translateX(3px);
		color: var(--ds-color-spark);
	}
</style>
