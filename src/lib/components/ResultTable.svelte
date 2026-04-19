<script lang="ts">
	import type { BrewResult, RiceForm } from '$lib/types';

	let { result, riceForm = 'tteok' as RiceForm }: { result: BrewResult; riceForm?: RiceForm } = $props();

	function fmt(value: number): string {
		if (value <= 0) return '-';
		return value.toFixed(2);
	}


	/** 예상 술 생산량 = 총 쌀의 30% + 총 물 */
	let estimatedVolume = $derived(result.totalRice * 0.3 + result.totalWater);
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

	<div class="estimated-volume">
		예상 술 생산량 <strong>{fmt(estimatedVolume)} L</strong>
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
		padding: 0.85rem 0.75rem;
		text-align: center;
		border-bottom: 2px solid #e5e7eb;
		font-weight: 700;
		font-size: 0.9rem;
	}

	th {
		background: var(--color-primary);
		color: white;
		font-size: 0.8rem;
		font-weight: 800;
		letter-spacing: 0.02em;
	}

	.col-stage { width: 35%; }
	.col-num { width: 21.6%; }

	th:first-child, td.stage-name {
		text-align: left;
	}

	td.stage-name {
		font-weight: 800;
		color: var(--color-text);
	}

	.rice-form {
		font-size: 0.6rem;
		font-weight: 400;
		color: var(--color-muted);
		margin-left: 0.1rem;
	}

	tfoot td {
		font-weight: 800;
		border-top: 3px solid var(--color-primary);
		background: rgba(37, 99, 235, 0.06);
	}

	.estimated-volume {
		margin-top: 1.25rem;
		padding: 0.85rem 1rem;
		border-top: 2px solid #e5e7eb;
		font-size: 0.9rem;
		font-weight: 700;
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: var(--color-text);
	}

	.estimated-volume strong {
		font-size: 1.1rem;
		color: var(--color-primary);
	}

</style>
