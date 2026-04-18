<script lang="ts">
	import type { BrewResult } from '$lib/types';

	let { result }: { result: BrewResult } = $props();

	function fmt(value: number): string {
		if (value === 0) return '-';
		return Number.isInteger(value) ? value.toString() : value.toFixed(2);
	}

	/** 누룩은 내부 kg → 표시 g 변환 */
	function fmtNuruk(value: number): string {
		if (value === 0) return '-';
		const grams = value * 1000;
		return Number.isInteger(grams) ? grams.toString() : grams.toFixed(0);
	}
</script>

<div class="result-table">
	<table>
		<thead>
			<tr>
				<th class="col-stage">단계</th>
				<th class="col-form">쌀 형태</th>
				<th class="col-num">쌀 (kg)</th>
				<th class="col-num">물 (L)</th>
				<th class="col-num">누룩 (g)</th>
			</tr>
		</thead>
		<tbody>
			{#each result.stages as stage}
				<tr>
					<td class="stage-name">{stage.name}</td>
					<td class="rice-form">{stage.riceFormLabel}</td>
					<td>{fmt(stage.rice)}</td>
					<td>{fmt(stage.water)}</td>
					<td>{fmtNuruk(stage.nuruk)}</td>
				</tr>
			{/each}
		</tbody>
		<tfoot>
			<tr>
				<td class="stage-name">합계</td>
				<td></td>
				<td>{fmt(result.totalRice)}</td>
				<td>{fmt(result.totalWater)}</td>
				<td>{fmtNuruk(result.totalNuruk)}</td>
			</tr>
		</tfoot>
	</table>

	<div class="estimated-volume">
		예상 총량: <strong>{fmt(result.totalRice + result.totalWater)} L</strong>
	</div>

	<div class="info">
		<p class="nuruk-note">
			누룩은 밑술에만 넣습니다. 덧술에 누룩을 추가하면 과발효가 일어나 맛과 향이 변질될 수 있습니다.
		</p>
		<details class="taste-ref">
			<summary>쌀:물 비율에 따른 맛 변화 참고</summary>
			<table class="taste-table">
				<thead>
					<tr><th>쌀</th><th>물</th><th>맛</th><th>설명</th></tr>
				</thead>
				<tbody>
					<tr><td>1</td><td>1</td><td>기본</td><td>평균적인 맛</td></tr>
					<tr><td>1</td><td>0.8</td><td>단맛</td><td>전분이 많아 당이 많이 생성</td></tr>
					<tr><td>1</td><td>1.2</td><td>쓴맛/신맛</td><td>당도 낮고 알코올도수 낮아짐</td></tr>
				</tbody>
			</table>
		</details>
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
		padding: 0.75rem;
		text-align: center;
		border-bottom: 1px solid var(--color-border);
	}

	th {
		background: var(--color-primary);
		color: white;
		font-size: 0.875rem;
		font-weight: 600;
	}

	.col-stage { width: 20%; }
	.col-form { width: 20%; }
	.col-num { width: 20%; }

	th:first-child, td.stage-name, td.rice-form {
		text-align: left;
	}

	td.stage-name {
		font-weight: 600;
	}

	td.rice-form {
		font-size: 0.85rem;
		color: var(--color-muted);
	}

	tfoot td {
		font-weight: 700;
		border-top: 2px solid var(--color-primary);
		background: rgba(74, 103, 65, 0.05);
	}

	.estimated-volume {
		margin-top: 1rem;
		padding: 0.75rem;
		background: rgba(37, 99, 235, 0.05);
		border-radius: 6px;
		font-size: 0.9rem;
		text-align: center;
		color: var(--color-primary);
	}

	.info {
		margin-top: 1rem;
	}

	.nuruk-note {
		font-size: 0.8rem;
		color: var(--color-muted);
		padding: 0.75rem;
		background: rgba(234, 179, 8, 0.1);
		border-radius: 6px;
		border-left: 3px solid var(--color-accent);
	}

	.taste-ref {
		margin-top: 0.75rem;
		font-size: 0.8rem;
		color: var(--color-muted);
	}

	.taste-ref summary {
		cursor: pointer;
		font-weight: 600;
	}

	.taste-table {
		margin-top: 0.5rem;
		font-size: 0.8rem;
	}

	.taste-table th {
		font-size: 0.75rem;
	}
</style>
