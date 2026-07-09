<script lang="ts">
	import { onMount } from 'svelte';
	import type { ThemeMode } from '$entities/theme/model';
	import { ThemeSetting } from './ThemeSetting.svelte';

	type ThemeOption = { mode: ThemeMode; label: string; hint: string };

	const themeOptions: ThemeOption[] = [
		{ mode: 'system', label: '시스템', hint: '기기 설정에 맞춤' },
		{ mode: 'light', label: '라이트', hint: '항상 밝게' },
		{ mode: 'dark', label: '다크', hint: '항상 어둡게' }
	];

	const setting = new ThemeSetting();
	onMount(() => setting.sync());
</script>

<section>
	<h2>테마</h2>
	<p class="desc">화면 색상 테마를 선택하세요. 시스템은 기기의 다크모드 설정을 따릅니다.</p>
	<div class="segmented" role="radiogroup" aria-label="테마">
		{#each themeOptions as opt (opt.mode)}
			<button
				type="button"
				role="radio"
				aria-checked={setting.current === opt.mode}
				class="segment"
				class:segment--active={setting.current === opt.mode}
				onclick={() => setting.select(opt.mode)}
			>
				<span class="segment-label">{opt.label}</span>
				<span class="segment-hint">{opt.hint}</span>
			</button>
		{/each}
	</div>
</section>

<style>
	section {
		padding-top: var(--ds-space-lg);
		margin-bottom: var(--ds-space-xl);
		border-top: var(--ds-border-width) solid var(--ds-color-border-1);
	}

	h2 {
		font-family: var(--ds-font-display);
		font-size: var(--ds-text-lg);
		font-weight: var(--ds-weight-semibold);
		color: var(--ds-color-ink-1);
		margin-bottom: var(--ds-space-sm);
	}

	.desc {
		font-size: var(--ds-text-sm);
		line-height: var(--ds-leading-normal);
		color: var(--ds-color-ink-3);
		margin-bottom: var(--ds-space-md);
	}

	/* Segmented control — 3 equal cells in a notebook-paper frame */
	.segmented {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		border-radius: var(--ds-radius-md);
		background: var(--ds-color-surface);
		overflow: hidden;
	}

	.segment {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		padding: var(--ds-space-md) var(--ds-space-sm);
		background: transparent;
		border: none;
		cursor: pointer;
		text-align: center;
		transition: background-color var(--ds-duration-short) var(--ds-ease-out);
	}

	.segment + .segment {
		border-left: var(--ds-border-width) solid var(--ds-color-border-2);
	}

	.segment-label {
		font-size: var(--ds-text-base);
		font-weight: var(--ds-weight-semibold);
		color: var(--ds-color-ink-2);
	}

	.segment-hint {
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-4);
	}

	.segment:hover:not(.segment--active) {
		background: var(--ds-color-hover);
	}

	.segment:focus-visible {
		outline: 2px solid var(--ds-color-focus);
		outline-offset: -2px;
	}

	.segment--active {
		background: var(--ds-color-ink-1);
	}

	.segment--active .segment-label {
		color: var(--ds-color-on-action);
	}

	.segment--active .segment-hint {
		color: color-mix(in srgb, var(--ds-color-on-action) 70%, transparent);
	}
</style>
