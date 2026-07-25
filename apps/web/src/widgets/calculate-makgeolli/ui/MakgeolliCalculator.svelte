<script lang="ts">
	import { MakgeolliCalculatorState, INPUT_MAX } from './MakgeolliCalculatorState.svelte';
	import IngredientInput from './IngredientInput.svelte';
	import ResultTable from './ResultTable.svelte';
	import type { RiceFormType, BrewTabType } from '$entities/makgeolli/model';

	// 표시 텍스트(라벨)는 그리는 뷰에서 관리한다. 상태 class에는 두지 않는다.
	const TABS: { id: BrewTabType; label: string }[] = [
		{ id: 'DANYANG', label: '단양주' },
		{ id: 'IYANG', label: '이양주' },
		{ id: 'SAMYANG', label: '삼양주' }
	];

	const RICE_FORM_LABELS: Record<RiceFormType, string> = {
		GODUBAP: '고두밥',
		TTEOK: '떡 (설기)',
		BEOMBUK: '범벅',
		JUK: '죽'
	};

	const STAGE_NAMES: Record<number, string[]> = {
		1: ['전량 투입'],
		2: ['밑술', '덧술'],
		3: ['밑술', '덧술', '덧술2']
	};

	const NURUK_HINTS: Record<BrewTabType, string> = {
		DANYANG: '표준 20~25%',
		IYANG: '표준 15~20%',
		SAMYANG: '표준 10~15%'
	};

	const calc = new MakgeolliCalculatorState();
</script>

<div class="calculator">
	<div class="col">
		<section class="card">
			<h2 class="section-label">재료 입력</h2>
			<IngredientInput
				bind:totalRice={calc.totalRice}
				bind:riceForm={calc.riceForm}
				bind:waterRatio={calc.waterRatioPercent}
				bind:nurukRatio={calc.nurukRatio}
				riceFormLabels={RICE_FORM_LABELS}
				nurukHint={NURUK_HINTS[calc.activeTab]}
				nurukDefault={calc.nurukDefault}
				showGodubap={calc.showGodubap}
				riceMax={INPUT_MAX.rice}
				waterMax={INPUT_MAX.water}
				nurukMax={INPUT_MAX.nuruk}
			/>
		</section>
	</div>

	<div class="col">
		<p class="guide">
			담금을 <strong>여러 번 나눌수록</strong>(단→이→삼양주) 도수가 높아집니다.<br />
			물을 <strong>적게</strong> 잡을수록 진하고 도수가 오르지만, 효모 내성까지가 한계입니다.<br />
			계산값은 거르기 전 <strong>원주</strong> 기준이라, 드실 땐 물을 타 도수를 낮춥니다.
		</p>
		{#if calc.riceForm === 'TTEOK'}
			<p class="tteok-warning"><strong>떡(설기)을 사용하면 발효가 더디거나 맛이 극단적으로 달아질 수 있습니다.</strong><br/>초보자에게는 죽이나 범벅을 권장합니다.</p>
		{/if}
		<section class="card">
			<h2 class="section-label">배합 결과</h2>
			<nav class="tabs">
				{#each TABS as tab}
					<button
						class="tab"
						class:active={calc.activeTab === tab.id}
						onclick={() => calc.switchTab(tab.id)}
					>
						{tab.label}
					</button>
				{/each}
			</nav>

			{#if calc.totalRice > 0}
				<ResultTable
					brew={calc.brew}
					stageNames={STAGE_NAMES[calc.brew.stages.length]}
					riceFormLabels={RICE_FORM_LABELS}
				/>
			{:else}
				<p class="empty">쌀 총량을 입력해주세요.</p>
			{/if}
		</section>
	</div>
</div>

<style>
	.calculator {
		display: flex;
		flex-direction: column;
		gap: var(--ds-space-xl);
	}

	.col {
		display: flex;
		flex-direction: column;
		gap: var(--ds-space-xl);
	}

	/* lg 1024↑: 재료 입력 | 배합 결과 2컬럼. 입력 컬럼은 폭을 캡해 필드가 늘어지지 않게 하고,
	   결과 컬럼이 나머지를 갖는다 (design-system 브레이크포인트 lg 1024px). */
	@media (min-width: 1024px) {
		.calculator {
			display: grid;
			grid-template-columns: minmax(340px, 440px) 1fr;
			align-items: start;
			gap: var(--ds-space-2xl);
		}
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

	.guide {
		padding: var(--ds-space-md);
		background: var(--ds-color-surface);
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		border-left: 3px solid var(--ds-color-warning);
		border-radius: var(--ds-radius-sm);
		font-size: var(--ds-text-sm);
		color: var(--ds-color-ink-2);
		line-height: 1.55;
	}

	.guide strong {
		color: var(--ds-color-ink-1);
	}

	.tteok-warning {
		padding: var(--ds-space-md);
		background: var(--ds-color-surface);
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		border-left: 3px solid var(--ds-color-warning);
		border-radius: var(--ds-radius-sm);
		font-size: var(--ds-text-sm);
		color: var(--ds-color-ink-1);
		line-height: 1.5;
	}

	.empty {
		text-align: center;
		font-family: var(--ds-font-mono);
		color: var(--ds-color-ink-3);
		padding: var(--ds-space-2xl);
		font-size: var(--ds-text-sm);
	}
</style>
