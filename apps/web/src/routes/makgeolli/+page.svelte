<script lang="ts">
	import { useMakgeolli } from './useMakgeolli.svelte';
	import type { BrewTab, BrewMeta, StageNames, NurukHints } from './types';
	import IngredientInput from '$lib/components/IngredientInput.svelte';
	import ResultTable from '$lib/components/ResultTable.svelte';

	const tabs: { id: BrewTab; label: string }[] = [
		{ id: 'DANYANG', label: '단양주' },
		{ id: 'IYANG',   label: '이양주' },
		{ id: 'SAMYANG', label: '삼양주' }
	];

	const brewMeta: BrewMeta = {
		DANYANG: { type: 'danyang', label: '단양주' },
		IYANG:   { type: 'iyang',   label: '이양주' },
		SAMYANG: { type: 'samyang', label: '삼양주' }
	};

	const stageNames: StageNames = {
		1: ['전량 투입'],
		2: ['밑술', '덧술'],
		3: ['밑술', '덧술', '덧술2']
	};

	const nurukHints: NurukHints = {
		DANYANG: '표준 20~25%',
		IYANG:   '표준 15~20%',
		SAMYANG: '표준 10~15%'
	};

	const m = useMakgeolli(brewMeta, stageNames, nurukHints);
</script>

<svelte:head>
	<title>막걸리 계산기 - 알콜미터</title>
	<meta name="description" content="막걸리 양조 배합 계산기. 쌀 총량과 형태를 입력하면 단양주, 이양주, 삼양주별 쌀·물·누룩 비율을 자동 계산합니다." />
	<link rel="canonical" href="https://alcolmeter.kr/makgeolli" />
</svelte:head>

<div class="calculator">
	<section class="card">
		<h2 class="section-label">재료 입력</h2>
		<IngredientInput
			bind:totalRice={m.totalRice}
			bind:riceForm={m.riceForm}
			bind:waterRatio={m.waterRatioPercent}
			bind:nurukRatio={m.nurukRatio}
			nurukHint={m.nurukHint}
			nurukDefault={m.nurukDefault}
			showGodubap={m.showGodubap}
		/>
	</section>

	{#if m.riceForm === 'tteok'}
		<p class="tteok-warning">떡(설기)을 사용하면 발효가 더디거나 맛이 극단적으로 달아질 수 있습니다.<br/>초보자에게는 죽이나 범벅을 권장합니다.</p>
	{/if}

	<section class="card">
		<h2 class="section-label">배합 결과</h2>
		<nav class="tabs">
			{#each tabs as tab}
				<button
					class="tab"
					class:active={m.activeTab === tab.id}
					onclick={() => m.switchTab(tab.id)}
				>
					{tab.label}
				</button>
			{/each}
		</nav>

		{#if m.totalRice > 0}
			<ResultTable result={m.result} riceForm={m.riceForm} availableRice={m.totalRice} />
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
