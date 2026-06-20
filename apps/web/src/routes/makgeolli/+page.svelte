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
		gap: var(--ds-space-xl);
	}

	.section-label {
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-xs);
		font-weight: var(--ds-weight-medium);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ds-color-ink-3);
		margin-bottom: var(--ds-space-lg);
	}

	.card {
		background: var(--ds-color-surface);
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		border-radius: var(--ds-radius-lg);
		box-shadow: var(--ds-shadow-paper);
		padding: var(--ds-space-xl);
	}

	.tabs {
		display: flex;
		gap: var(--ds-space-sm);
		margin-bottom: var(--ds-space-xl);
	}

	.tab {
		flex: 1;
		padding: var(--ds-space-sm) var(--ds-space-md);
		background: var(--ds-color-surface);
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		border-radius: var(--ds-radius-md);
		font-size: var(--ds-text-sm);
		font-weight: var(--ds-weight-medium);
		font-family: var(--ds-font-sans);
		color: var(--ds-color-ink-2);
		cursor: pointer;
		transition: border-color var(--ds-duration-short) var(--ds-ease-out),
			background-color var(--ds-duration-short) var(--ds-ease-out),
			color var(--ds-duration-short) var(--ds-ease-out);
	}

	.tab.active {
		color: var(--ds-color-on-action);
		background: var(--ds-color-action);
		border-color: var(--ds-color-action);
	}

	.tab:hover:not(.active) {
		border-color: var(--ds-color-border-3);
		color: var(--ds-color-ink-1);
	}

	.tteok-warning {
		margin-top: var(--ds-space-lg);
		padding: var(--ds-space-md);
		background: var(--ds-color-surface);
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		border-left: 3px solid var(--ds-color-warning);
		border-radius: var(--ds-radius-sm);
		font-size: var(--ds-text-sm);
		font-weight: var(--ds-weight-medium);
		color: var(--ds-color-ink-1);
	}

	.empty {
		text-align: center;
		font-family: var(--ds-font-mono);
		color: var(--ds-color-ink-3);
		padding: var(--ds-space-2xl);
		font-size: var(--ds-text-sm);
	}
</style>
