<script lang="ts">
	import { RICE_FORM_LABELS, type RiceForm } from '$lib/types';

	let {
		totalRice = $bindable(6),
		riceForm = $bindable('tteok' as RiceForm),
		nurukRatio = $bindable(10),
		nurukHint = '표준 10%'
	}: {
		totalRice: number;
		riceForm: RiceForm;
		nurukRatio: number;
		nurukHint?: string;
	} = $props();

	let showTooltip = $state(false);

	const riceFormOptions: { value: RiceForm; label: string }[] = Object.entries(RICE_FORM_LABELS).map(
		([value, label]) => ({ value: value as RiceForm, label })
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
		<label for="nuruk-ratio">
			누룩 비율 (쌀 총량 대비 %)
			<span class="info-wrap">
				<button class="info-btn" onclick={() => showTooltip = !showTooltip}>ℹ</button>
				{#if showTooltip}
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
		left: 50%;
		transform: translateX(-50%);
		background: var(--color-text);
		color: #ffffff;
		font-size: 0.7rem;
		font-weight: 700;
		padding: 0.4rem 0.6rem;
		border-radius: 6px;
		white-space: nowrap;
	}
</style>
