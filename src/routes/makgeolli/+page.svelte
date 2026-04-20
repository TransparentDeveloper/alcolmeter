<script lang="ts">
	import type { RiceForm } from '$lib/types';
	import { calculateDanyang, calculateIyang, calculateSamyang } from '$lib/calculator/makgeolli';
	import IngredientInput from '$lib/components/IngredientInput.svelte';
	import ResultTable from '$lib/components/ResultTable.svelte';

	let totalRice = $state(6);
	let riceForm: RiceForm = $state('tteok');
	let waterRatioPercent = $state(100);
	let nurukRatio = $state(15);

	type BrewTab = 'danyang' | 'iyang' | 'samyang';
	let activeTab: BrewTab = $state('iyang');

	const NURUK_CONFIG: Record<BrewTab, { default: number; min: number; max: number; hint: string }> = {
		danyang: { default: 20, min: 20, max: 25, hint: '표준 20~25%' },
		iyang:   { default: 15, min: 15, max: 20, hint: '표준 15~20%' },
		samyang: { default: 10, min: 10, max: 15, hint: '표준 10~15%' }
	};

	let nurukHint = $derived(NURUK_CONFIG[activeTab].hint);
	let nurukDefault = $derived(NURUK_CONFIG[activeTab].default);

	const tabs: { id: BrewTab; label: string }[] = [
		{ id: 'danyang', label: '단양주' },
		{ id: 'iyang', label: '이양주' },
		{ id: 'samyang', label: '삼양주' }
	];

	let showGodubap = $derived(activeTab === 'danyang');

	function switchTab(tabId: BrewTab) {
		activeTab = tabId;
		nurukRatio = NURUK_CONFIG[tabId].default;
		// 이양주/삼양주로 전환 시 고두밥이면 떡으로 변경
		if (tabId !== 'danyang' && riceForm === 'godubap') {
			riceForm = 'tteok';
		}
	}

	let result = $derived.by(() => {
		const rice = Math.max(0, totalRice || 0);
		const water = Math.max(0, (waterRatioPercent || 100)) / 100;
		const nuruk = Math.max(0, nurukRatio || NURUK_CONFIG[activeTab].default);
		switch (activeTab) {
			case 'danyang':
				return calculateDanyang(rice, riceForm, water, nuruk);
			case 'iyang':
				return calculateIyang(rice, riceForm, water, nuruk);
			case 'samyang':
				return calculateSamyang(rice, riceForm, water, nuruk);
		}
	});
</script>

<svelte:head>
	<title>막걸리 계산기 - 알콜미터</title>
	<meta name="description" content="막걸리 양조 배합 계산기. 쌀 총량과 형태를 입력하면 단양주, 이양주, 삼양주별 쌀·물·누룩 비율을 자동 계산합니다." />
</svelte:head>

<div class="calculator">
	<section class="card">
		<h2 class="section-label">재료 입력</h2>
		<IngredientInput bind:totalRice bind:riceForm bind:waterRatio={waterRatioPercent} bind:nurukRatio {nurukHint} {nurukDefault} {showGodubap} />
	</section>

	{#if riceForm === 'tteok'}
		<p class="tteok-warning">떡(설기)을 사용하면 발효가 더디거나 맛이 극단적으로 달아질 수 있습니다.<br/>초보자에게는 죽이나 범벅을 권장합니다.</p>
	{/if}

	<section class="card">
		<h2 class="section-label">배합 결과</h2>
		<nav class="tabs">
			{#each tabs as tab}
				<button
					class="tab"
					class:active={activeTab === tab.id}
					onclick={() => switchTab(tab.id)}
				>
					{tab.label}
				</button>
			{/each}
		</nav>

		{#if totalRice > 0}
			<ResultTable {result} {riceForm} availableRice={totalRice || 0} />
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

.section-label {
		font-size: 0.95rem;
		font-weight: 800;
		color: var(--color-text);
		letter-spacing: -0.01em;
		margin-bottom: 1rem;
	}

	.card {
		background: var(--color-bg);
		border-radius: var(--radius-lg);
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
		border-radius: var(--radius);
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
		border-radius: var(--radius);
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
