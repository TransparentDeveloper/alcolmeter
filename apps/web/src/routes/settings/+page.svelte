<script lang="ts">
	import { onMount } from 'svelte';
	import { useSettings } from './useSettings.svelte';
	import type { ThemeOption } from './types';
	import Seo from '$lib/components/Seo.svelte';

	const themeOptions: ThemeOption[] = [
		{ mode: 'system', label: '시스템', hint: '기기 설정에 맞춤' },
		{ mode: 'light', label: '라이트', hint: '항상 밝게' },
		{ mode: 'dark', label: '다크', hint: '항상 어둡게' }
	];

	const settings = useSettings();
	onMount(settings.sync);
</script>

<Seo
	title="설정 - 알콜미터"
	description="알콜미터 화면 테마 등 환경설정."
	path="/settings"
	image="/og/settings.png"
/>

<article>
	<h1>설정</h1>
	<p class="updated">화면 환경을 취향에 맞게 조정합니다.</p>

	<section>
		<h2>테마</h2>
		<p class="desc">화면 색상 테마를 선택하세요. 시스템은 기기의 다크모드 설정을 따릅니다.</p>
		<div class="segmented" role="radiogroup" aria-label="테마">
			{#each themeOptions as opt (opt.mode)}
				<button
					type="button"
					role="radio"
					aria-checked={settings.theme === opt.mode}
					class="segment"
					class:segment--active={settings.theme === opt.mode}
					onclick={() => settings.select(opt.mode)}
				>
					<span class="segment-label">{opt.label}</span>
					<span class="segment-hint">{opt.hint}</span>
				</button>
			{/each}
		</div>
	</section>
</article>

<style>
	article {
		max-width: var(--ds-container);
	}

	h1 {
		font-family: var(--ds-font-display);
		font-size: var(--ds-text-2xl);
		font-weight: var(--ds-weight-bold);
		letter-spacing: var(--ds-tracking-tight);
		color: var(--ds-color-ink-1);
		margin-bottom: var(--ds-space-xs);
	}

	.updated {
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-3);
		margin-bottom: var(--ds-space-3xl);
	}

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
