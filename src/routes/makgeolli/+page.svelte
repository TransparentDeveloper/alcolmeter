<script lang="ts">
	import type { RiceForm } from '$lib/types';
	import { calculateDanyang, calculateIyang, calculateSamyang } from '$lib/calculator/makgeolli';
	import IngredientInput from '$lib/components/IngredientInput.svelte';
	import ResultTable from '$lib/components/ResultTable.svelte';

	let totalRice = $state(6);
	let riceForm: RiceForm = $state('tteok');

	type BrewTab = 'danyang' | 'iyang' | 'samyang';
	let activeTab: BrewTab = $state('iyang');

	const tabs: { id: BrewTab; label: string }[] = [
		{ id: 'danyang', label: '단양주' },
		{ id: 'iyang', label: '이양주' },
		{ id: 'samyang', label: '삼양주' }
	];

	let result = $derived.by(() => {
		const rice = Math.max(0, totalRice || 0);
		switch (activeTab) {
			case 'danyang':
				return calculateDanyang(rice, riceForm);
			case 'iyang':
				return calculateIyang(rice, riceForm);
			case 'samyang':
				return calculateSamyang(rice, riceForm);
		}
	});
</script>

<svelte:head>
	<title>막걸리 계산기 - 알콜미터</title>
</svelte:head>

<div class="calculator">
	<h1>막걸리 계산기</h1>
	<p class="subtitle">쌀의 양과 형태를 입력하면 이상적인 배합 비율을 계산합니다</p>

	<div class="card">
		<IngredientInput bind:totalRice bind:riceForm />
	</div>

	<div class="card result-card">
		<nav class="tabs">
			{#each tabs as tab}
				<button
					class="tab"
					class:active={activeTab === tab.id}
					onclick={() => activeTab = tab.id}
				>
					{tab.label}
				</button>
			{/each}
		</nav>

		{#if totalRice > 0}
			<ResultTable {result} />
		{:else}
			<p class="empty">쌀 총량을 입력해주세요.</p>
		{/if}
	</div>
</div>

<style>
	.calculator {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	h1 {
		font-size: 1.5rem;
		color: var(--color-primary);
	}

	.subtitle {
		font-size: 0.9rem;
		color: var(--color-muted);
		margin-top: -1rem;
	}

	.card {
		background: var(--color-card);
		border-radius: 12px;
		padding: 1.5rem;
		border: 1px solid var(--color-border);
	}

	.tabs {
		display: flex;
		gap: 0;
		margin-bottom: 1.5rem;
		border-bottom: 2px solid var(--color-border);
	}

	.tab {
		flex: 1;
		padding: 0.75rem 1rem;
		background: none;
		border: none;
		font-size: 0.95rem;
		font-weight: 500;
		color: var(--color-muted);
		cursor: pointer;
		border-bottom: 2px solid transparent;
		margin-bottom: -2px;
		transition: all 0.2s;
	}

	.tab.active {
		color: var(--color-primary);
		border-bottom-color: var(--color-primary);
		font-weight: 700;
	}

	.tab:hover:not(.active) {
		color: var(--color-text);
	}

	.empty {
		text-align: center;
		color: var(--color-muted);
		padding: 2rem;
	}
</style>
