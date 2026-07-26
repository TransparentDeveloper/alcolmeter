<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		label,
		active = false,
		disabled = false,
		onclick,
		children
	}: {
		label: string;
		active?: boolean;
		disabled?: boolean;
		onclick: () => void;
		children: Snippet;
	} = $props();
</script>

<!-- mousedown preventDefault: 본문 선택(selection)을 잃지 않는다 -->
<button
	type="button"
	class:active
	{disabled}
	aria-label={label}
	title={label}
	aria-pressed={active}
	onmousedown={(e) => e.preventDefault()}
	{onclick}
>
	{@render children()}
</button>

<style>
	button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 2rem;
		height: 2rem;
		padding: 0 var(--ds-space-xs);
		font: inherit;
		font-size: var(--ds-text-sm);
		color: var(--ds-color-ink-2);
		background: none;
		border: none;
		border-radius: var(--ds-radius-sm);
		cursor: pointer;
		transition:
			background-color var(--ds-duration-short) var(--ds-ease-out),
			color var(--ds-duration-short) var(--ds-ease-out);
	}
	button:hover:not(:disabled) {
		background: var(--ds-color-hover);
		color: var(--ds-color-ink-1);
	}
	button:disabled {
		color: var(--ds-color-ink-4);
		cursor: default;
	}
	/* 토글된 상태: 중립 눌림(12% 오버레이) — 링크 파랑과 헷갈리지 않게 */
	button.active {
		color: var(--ds-color-ink-1);
		background: var(--ds-color-active);
	}
</style>
