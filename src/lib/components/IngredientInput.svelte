<script lang="ts">
	import { RICE_FORM_LABELS, type RiceForm } from '$lib/types';

	let {
		totalRice = $bindable(6),
		riceForm = $bindable('tteok' as RiceForm)
	}: {
		totalRice: number;
		riceForm: RiceForm;
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
</section>

<style>
	.input-section {
		display: flex;
		gap: 1.5rem;
		flex-wrap: wrap;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		flex: 1;
		min-width: 180px;
	}

	label {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-muted);
	}

	input, select {
		padding: 0.75rem;
		border: 1px solid var(--color-border);
		border-radius: 8px;
		font-size: 1rem;
		background: var(--color-card);
		color: var(--color-text);
	}

	input:focus, select:focus {
		outline: 2px solid var(--color-primary);
		outline-offset: -1px;
	}
</style>
