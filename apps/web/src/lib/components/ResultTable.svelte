<script lang="ts">
	import type { BrewResult, RiceForm } from '$lib/types';

	let { result, riceForm = 'tteok' as RiceForm, availableRice = 0 }: { result: BrewResult; riceForm?: RiceForm; availableRice?: number } = $props();

	function fmt(value: number): string {
		if (value <= 0) return '-';
		return value.toFixed(2);
	}
</script>

<div class="result-table">
	<table>
		<thead>
			<tr>
				<th class="col-stage">단계</th>
				<th class="col-num">쌀 (kg)</th>
				<th class="col-num">물 (L)</th>
				<th class="col-num">누룩 (kg)</th>
			</tr>
		</thead>
		<tbody>
			{#each result.stages as stage}
				<tr>
					<td class="stage-name">{stage.name} <span class="rice-form">{stage.riceFormLabel}</span></td>
					<td>{fmt(stage.rice)}</td>
					<td>{fmt(stage.water)}</td>
					<td>{fmt(stage.nuruk)}</td>
				</tr>
			{/each}
		</tbody>
		<tfoot>
			<tr>
				<td class="stage-name">합계</td>
				<td>{fmt(result.totalRice)}</td>
				<td>{fmt(result.totalWater)}</td>
				<td>{fmt(result.totalNuruk)}</td>
			</tr>
		</tfoot>
	</table>

	<div class="estimates">
		<div class="estimate-item">
			예상 도수 <strong>{result.estimates.alcoholPercent.toFixed(1)} %</strong>
		</div>
		<div class="estimate-item">
			예상 생산량 <strong>{fmt(result.estimates.volumeLiters)} L</strong>
		</div>
	</div>

</div>

<style>
	.result-table {
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		table-layout: fixed;
	}

	th, td {
		padding: var(--ds-space-md) var(--ds-space-sm);
		text-align: center;
		border-bottom: var(--ds-border-width) solid var(--ds-color-border-1);
		font-size: var(--ds-text-sm);
	}

	td:not(.stage-name) {
		font-family: var(--ds-font-mono);
		font-variant-numeric: tabular-nums;
		color: var(--ds-color-ink-1);
	}

	th {
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-xs);
		font-weight: var(--ds-weight-medium);
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--ds-color-ink-3);
		border-bottom-color: var(--ds-color-border-2);
	}

	.col-stage { width: 35%; }
	.col-num { width: 21.6%; }

	th:first-child, td.stage-name {
		text-align: left;
	}

	td.stage-name {
		font-weight: var(--ds-weight-semibold);
		color: var(--ds-color-ink-1);
	}

	.rice-form {
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-xs);
		font-weight: var(--ds-weight-regular);
		color: var(--ds-color-ink-3);
		margin-left: 0.2rem;
	}

	tfoot td {
		font-weight: var(--ds-weight-semibold);
		border-top: 2px solid var(--ds-color-border-3);
		border-bottom: none;
	}

	.estimates {
		margin-top: var(--ds-space-lg);
		border-top: var(--ds-border-width) solid var(--ds-color-border-1);
		display: flex;
	}

	.estimate-item {
		flex: 1;
		padding: var(--ds-space-md);
		font-size: var(--ds-text-sm);
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: var(--ds-space-sm);
		color: var(--ds-color-ink-2);
		white-space: nowrap;
	}

	.estimate-item + .estimate-item {
		border-left: var(--ds-border-width) solid var(--ds-color-border-1);
	}

	.estimate-item strong {
		font-family: var(--ds-font-mono);
		font-variant-numeric: tabular-nums;
		font-size: var(--ds-text-base);
		color: var(--ds-color-spark);
		white-space: nowrap;
	}

	/* 512px 이하: 라벨/값을 세로로 배치해 큰 값이 옆으로 잘리지 않게 */
	@media (max-width: 512px) {
		.estimate-item {
			flex-direction: column;
			align-items: flex-start;
			gap: var(--ds-space-2xs);
		}
	}

</style>
