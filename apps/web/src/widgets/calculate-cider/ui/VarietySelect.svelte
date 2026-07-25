<script lang="ts">
	import type { AppleVarietyType } from '$entities/cider/model';

	let {
		value = $bindable('FUJI' as AppleVarietyType),
		options
	}: {
		value: AppleVarietyType;
		options: { value: AppleVarietyType; label: string; hint: string }[];
	} = $props();
</script>

<div class="variety-list" role="radiogroup" aria-label="사과 품종">
	{#each options as opt}
		<button
			type="button"
			class="variety-row"
			class:selected={value === opt.value}
			role="radio"
			aria-checked={value === opt.value}
			onclick={() => (value = opt.value)}
		>
			<span class="variety-mark">{value === opt.value ? '●' : '○'}</span>
			<span class="variety-name">{opt.label}</span>
			<span class="variety-hint">{opt.hint}</span>
		</button>
	{/each}
</div>

<style>
	.variety-list {
		display: flex;
		flex-direction: column;
	}

	.variety-row {
		display: flex;
		align-items: center;
		gap: var(--ds-space-md);
		width: 100%;
		padding: var(--ds-space-md) var(--ds-space-sm);
		background: transparent;
		border: none;
		border-bottom: var(--ds-border-width) solid var(--ds-color-border-1);
		font-family: var(--ds-font-sans);
		font-size: var(--ds-text-sm);
		color: var(--ds-color-ink-2);
		text-align: left;
		cursor: pointer;
		transition: color var(--ds-duration-short) var(--ds-ease-out);
	}

	.variety-row:first-child {
		border-top: var(--ds-border-width) solid var(--ds-color-border-1);
	}

	.variety-mark {
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-3);
		flex: none;
	}

	.variety-name {
		font-weight: var(--ds-weight-medium);
		color: var(--ds-color-ink-1);
	}

	.variety-hint {
		margin-left: auto;
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-3);
	}

	.variety-row:hover .variety-name {
		color: var(--ds-color-ink-1);
	}

	.variety-row.selected .variety-mark {
		color: var(--ds-color-action);
	}

	.variety-row.selected .variety-name {
		color: var(--ds-color-action);
		font-weight: var(--ds-weight-semibold);
	}
</style>
