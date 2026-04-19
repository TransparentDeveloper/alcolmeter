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
		<label for="nuruk-ratio">누룩 비율 (쌀 총량 대비 %)</label>
		<div class="ratio-input">
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
		gap: 1rem;
		flex-wrap: wrap;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		flex: 1;
		min-width: 160px;
	}

	label {
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--color-text);
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

	.ratio-input {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.ratio-input input {
		flex: 1;
	}

	.ratio-hint {
		font-size: 0.7rem;
		font-weight: 700;
		color: var(--color-primary);
		white-space: nowrap;
	}
</style>
