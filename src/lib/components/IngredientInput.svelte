<script lang="ts">
	import { RICE_FORM_LABELS, type RiceForm } from '$lib/types';

	let {
		totalRice = $bindable(6),
		riceForm = $bindable('tteok' as RiceForm),
		waterRatio = $bindable(100),
		nurukRatio = $bindable(10),
		nurukHint = '표준 10%',
		nurukDefault = 10,
		showGodubap = false
	}: {
		totalRice: number;
		riceForm: RiceForm;
		waterRatio: number;
		nurukRatio: number;
		nurukHint?: string;
		nurukDefault?: number;
		showGodubap?: boolean;
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
		<label for="total-rice">쌀 총량 (kg)</label>
		<input
			id="total-rice"
			type="number"
			min="0.1"
			step="0.1"
			placeholder="6"
			bind:value={totalRice}
		/>
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
		{#if waterRatio < 95 || waterRatio > 105 || (riceForm === 'tteok' && !showGodubap)}
			<div class="water-notes">
				{#if waterRatio < 95}<span class="water-note sweet">전분이 많아 당이 많이 생성됩니다.</span>{/if}
				{#if waterRatio > 105}<span class="water-note dry">당도 낮고 알코올도수가 낮아집니다.</span>{/if}
				{#if riceForm === 'tteok' && !showGodubap}<span class="water-note sweet">고두밥 투입 단계에서 가수하지 않습니다.</span>{/if}
			</div>
		{/if}
		<div class="input-with-hint">
			<input
				id="water-ratio"
				type="number"
				min="0"
				max="500"
				step="10"
				placeholder="100"
				bind:value={waterRatio}
			/>
			<span class="ratio-hint">표준 100%</span>
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
				max="50"
				step="1"
				placeholder={nurukDefault.toString()}
				bind:value={nurukRatio}
			/>
			<span class="ratio-hint">{nurukHint}</span>
		</div>
	</div>
</section>

<style>
	.input-section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		width: 100%;
	}

	label {
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--color-text);
		display: flex;
		align-items: center;
		gap: 0.25rem;
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
		padding: 0.75rem;
		border: 2px solid #d1d5db;
		border-radius: 10px;
		font-size: 1rem;
		font-weight: 700;
		font-family: inherit;
		background: #ffffff;
		color: var(--color-text);
	}

	.water-notes {
		display: flex;
		flex-direction: column;
		margin: -0.25rem 0 0;
	}

	.water-note {
		font-size: 0.72rem;
		font-weight: 700;
		line-height: 1.3;
	}

	.water-note.sweet {
		color: #92400e;
	}

	.water-note.dry {
		color: var(--color-primary);
	}

	input:focus, select:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	.input-with-hint {
		position: relative;
	}

	.input-with-hint input {
		width: 100%;
		padding-right: 7rem;
	}

	.ratio-hint {
		position: absolute;
		right: 0.75rem;
		top: 50%;
		transform: translateY(-50%);
		font-size: 0.7rem;
		font-weight: 700;
		color: var(--color-muted);
		pointer-events: none;
	}

	.info-wrap {
		position: relative;
		display: inline-flex;
	}

	.info-btn {
		width: 1.3rem;
		height: 1.3rem;
		border-radius: 50%;
		border: 2px solid var(--color-primary);
		background: var(--color-primary);
		font-size: 0.65rem;
		color: #ffffff;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-family: inherit;
		font-weight: 800;
		line-height: 1;
		padding: 0;
	}

	.info-btn:hover {
		opacity: 0.8;
	}

	.tooltip {
		position: absolute;
		bottom: calc(100% + 6px);
		left: 0;
		background: var(--color-text);
		color: #ffffff;
		font-size: 0.7rem;
		font-weight: 700;
		padding: 0.5rem 0.75rem;
		border-radius: 6px;
		white-space: pre-line;
		line-height: 1.6;
		min-width: max-content;
	}
</style>
