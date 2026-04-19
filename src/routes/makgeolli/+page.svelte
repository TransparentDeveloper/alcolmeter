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
	<div class="page-header">
		<h1>막걸리 계산기</h1>
		<p class="subtitle">쌀의 양과 형태를 입력하면 이상적인 배합 비율을 계산합니다</p>
	</div>

	<div class="hero-banner">
		<span>송학곡자 기준</span> · 누룩 투입 비율 10%
	</div>

	<section class="card">
		<h2 class="section-label">재료 입력</h2>
		<IngredientInput bind:totalRice bind:riceForm />
	</section>

	<section class="card">
		<h2 class="section-label">배합 결과</h2>
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
			{#if riceForm === 'tteok'}
				<p class="tteok-warning">떡(설기)을 사용하면 발효가 더디거나 맛이 극단적으로 달아질 수 있습니다. 초보자에게는 죽이나 범벅을 권장합니다.</p>
			{/if}
		{:else}
			<p class="empty">쌀 총량을 입력해주세요.</p>
		{/if}
	</section>
</div>

<style>
	.calculator {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.page-header {
		margin-bottom: 0.5rem;
	}

	h1 {
		font-size: 1.35rem;
		font-weight: 800;
		color: var(--color-text);
		letter-spacing: -0.02em;
	}

	.subtitle {
		font-size: 0.85rem;
		color: var(--color-muted);
		margin-top: 0.25rem;
	}

	.hero-banner {
		background: var(--color-primary);
		color: #ffffff;
		padding: 0.85rem 1.25rem;
		border-radius: var(--radius);
		font-size: 0.85rem;
		font-weight: 700;
		text-align: center;
	}

	.hero-banner span {
		font-weight: 800;
	}

	.section-label {
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--color-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: 1rem;
	}

	.card {
		background: var(--color-bg);
		border-radius: var(--radius);
		padding: 1.5rem;
		border: 2.5px solid #d1d5db;
	}

	.tabs {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1.5rem;
	}

	.tab {
		flex: 1;
		padding: 0.6rem 1rem;
		background: var(--color-card);
		border: 2.5px solid #d1d5db;
		border-radius: 8px;
		font-size: 0.85rem;
		font-weight: 700;
		font-family: inherit;
		color: var(--color-muted);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.tab.active {
		color: #ffffff;
		background: var(--color-primary);
		border-color: var(--color-primary);
	}

	.tab:hover:not(.active) {
		border-color: #9ca3af;
		color: var(--color-text);
	}

	.tteok-warning {
		margin-top: 1rem;
		padding: 0.85rem;
		background: #fef3c7;
		border: 2px solid #f59e0b;
		border-radius: 8px;
		font-size: 0.8rem;
		font-weight: 700;
		color: #92400e;
	}

	.empty {
		text-align: center;
		color: var(--color-muted);
		padding: 2rem;
		font-size: 0.9rem;
	}
</style>
