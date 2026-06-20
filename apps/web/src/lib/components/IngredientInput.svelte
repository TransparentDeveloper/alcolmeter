<script lang="ts">
	import { RICE_FORM_LABELS, type RiceForm } from '$lib/types';

	let {
		totalRice = $bindable(6),
		riceForm = $bindable('tteok' as RiceForm),
		waterRatio = $bindable(100),
		nurukRatio = $bindable(10),
		nurukHint = '표준 10%',
		nurukDefault = 10,
		showGodubap = false,
		riceMax = 999,
		waterMax = 500,
		nurukMax = 50
	}: {
		totalRice: number;
		riceForm: RiceForm;
		waterRatio: number;
		nurukRatio: number;
		nurukHint?: string;
		nurukDefault?: number;
		showGodubap?: boolean;
		riceMax?: number;
		waterMax?: number;
		nurukMax?: number;
	} = $props();

	let showNurukTooltip = $state(false);
	let showWaterTooltip = $state(false);

	let riceFormOptions = $derived(
		Object.entries(RICE_FORM_LABELS)
			.filter(([value]) => showGodubap || value !== 'godubap')
			.map(([value, label]) => ({ value: value as RiceForm, label }))
	);
</script>

<section class="input-section">
	<div class="field">
		<label for="total-rice">가용 쌀 총량 (kg)</label>
		<div class="input-with-hint">
			<input
				id="total-rice"
				type="number"
				min="0.1"
				max={riceMax}
				step="0.1"
				placeholder="6"
				bind:value={totalRice}
			/>
			<span class="ratio-hint">최대 {riceMax}kg</span>
		</div>
	</div>

	<div class="field">
		<label for="rice-form">밑술 쌀 형태</label>
		<select id="rice-form" bind:value={riceForm}>
			{#each riceFormOptions as option}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>
	</div>

		<div class="field">
			<label for="water-ratio">
				물 비율 (쌀 총량 대비 %)
				<span class="info-wrap">
					<button class="info-btn" onclick={() => showWaterTooltip = !showWaterTooltip}>ℹ</button>
					{#if showWaterTooltip}
						<span class="tooltip">ex)
1:0.9 → 90%
1:1 → 100%
1:1.1 → 110%</span>
					{/if}
				</span>
			</label>
			{#if waterRatio < 95}
				<div class="water-notes">
					<span class="water-note sweet">전분이 많아 당이 많이 생성됩니다.</span>
				</div>
			{:else if waterRatio > 105}
				<div class="water-notes">
					<span class="water-note dry">당도 낮고 알코올도수가 낮아집니다.</span>
				</div>
			{/if}
			<div class="input-with-hint">
				<input
					id="water-ratio"
					type="number"
					min="0"
					max={waterMax}
					step="10"
					placeholder="100"
					bind:value={waterRatio}
				/>
				<span class="ratio-hint">표준 100% · 최대 {waterMax}%</span>
			</div>
		</div>

	<div class="field">
		<label for="nuruk-ratio">
			누룩 비율 (쌀 총량 대비 %)
			<span class="info-wrap">
				<button class="info-btn" onclick={() => showNurukTooltip = !showNurukTooltip}>ℹ</button>
				{#if showNurukTooltip}
					<span class="tooltip">송학곡자 기준 권장 비율입니다</span>
				{/if}
			</span>
		</label>
		<div class="input-with-hint">
			<input
				id="nuruk-ratio"
				type="number"
				min="1"
				max={nurukMax}
				step="1"
				placeholder={nurukDefault.toString()}
				bind:value={nurukRatio}
			/>
			<span class="ratio-hint">{nurukHint} · 최대 {nurukMax}%</span>
		</div>
	</div>
</section>

<style>
	.input-section {
		display: flex;
		flex-direction: column;
		gap: var(--ds-space-lg);
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: var(--ds-space-sm);
		width: 100%;
	}

	label {
		font-size: var(--ds-text-sm);
		font-weight: var(--ds-weight-medium);
		color: var(--ds-color-ink-1);
		display: flex;
		align-items: center;
		gap: var(--ds-space-xs);
	}

	input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	input[type='number'] {
		-moz-appearance: textfield;
	}

	input, select {
		padding: var(--ds-space-sm) var(--ds-space-md);
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		border-radius: var(--ds-radius-md);
		font-size: var(--ds-text-base);
		font-family: var(--ds-font-sans);
		background: var(--ds-color-surface);
		color: var(--ds-color-ink-1);
		transition: border-color var(--ds-duration-short) var(--ds-ease-out),
			box-shadow var(--ds-duration-short) var(--ds-ease-out);
	}

	.water-notes {
		display: flex;
		flex-direction: column;
		margin: -0.25rem 0 0;
	}

	.water-note {
		font-size: var(--ds-text-xs);
		font-weight: var(--ds-weight-medium);
		line-height: 1.3;
	}

	.water-note.sweet {
		color: var(--ds-color-warning);
	}

	.water-note.dry {
		color: var(--ds-color-info);
	}

	input:hover, select:hover {
		border-color: var(--ds-color-border-3);
	}

	input:focus, select:focus {
		outline: none;
		border-color: var(--ds-color-focus);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--ds-color-focus) 22%, transparent);
	}

	.input-with-hint {
		position: relative;
	}

	.input-with-hint input {
		width: 100%;
		padding-right: 9.5rem;
	}

	.ratio-hint {
		position: absolute;
		right: var(--ds-space-md);
		top: 50%;
		transform: translateY(-50%);
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-3);
		pointer-events: none;
	}

	.info-wrap {
		position: relative;
		display: inline-flex;
	}

	.info-btn {
		width: 1.3rem;
		height: 1.3rem;
		border-radius: var(--ds-radius-full);
		border: var(--ds-border-width) solid var(--ds-color-action);
		background: var(--ds-color-action);
		font-size: 0.65rem;
		color: var(--ds-color-on-action);
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-family: var(--ds-font-sans);
		font-weight: var(--ds-weight-bold);
		line-height: 1;
		padding: 0;
		transition: background-color var(--ds-duration-short) var(--ds-ease-out);
	}

	.info-btn:hover {
		background: var(--ds-color-action-hover);
	}

	.tooltip {
		position: absolute;
		bottom: calc(100% + 6px);
		left: 0;
		background: var(--ds-color-ink-1);
		color: var(--ds-color-surface);
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-xs);
		padding: var(--ds-space-sm) var(--ds-space-md);
		border-radius: var(--ds-radius-sm);
		white-space: pre-line;
		line-height: 1.6;
		min-width: max-content;
		z-index: 2;
	}
</style>
