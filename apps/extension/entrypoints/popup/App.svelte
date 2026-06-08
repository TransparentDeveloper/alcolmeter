<script lang="ts">
	declare const __APP_VERSION__: string;

	import { MakgeolliController } from '@alcolmeter/domain/makgeolli';
	import type { MakgeolliResult } from '@alcolmeter/domain/makgeolli';

	type RiceForm = 'godubap' | 'tteok' | 'beombuk' | 'juk';
	type BrewTab = 'DANYANG' | 'IYANG' | 'SAMYANG';

	const RICE_FORM_LABELS: Record<RiceForm, string> = {
		godubap: '고두밥',
		tteok: '떡(설기)',
		beombuk: '범벅',
		juk: '죽'
	};

	const TO_DOMAIN_RICE_FORM = {
		godubap: 'GODUBAP', tteok: 'TTEOK', beombuk: 'BEOMBUK', juk: 'JUK'
	} as const;

	const FROM_DOMAIN_RICE_FORM = {
		GODUBAP: 'godubap', TTEOK: 'tteok', BEOMBUK: 'beombuk', JUK: 'juk'
	} as const satisfies Record<'GODUBAP' | 'TTEOK' | 'BEOMBUK' | 'JUK', RiceForm>;

	const BREW_COUNT = { DANYANG: 1, IYANG: 2, SAMYANG: 3 } as const satisfies Record<BrewTab, 1 | 2 | 3>;

	const STAGE_NAMES: Record<1 | 2 | 3, string[]> = {
		1: ['전량 투입'],
		2: ['밑술', '덧술'],
		3: ['밑술', '덧술', '덧술2']
	};

	const NURUK_CONFIG: Record<BrewTab, { default: number; hint: string }> = {
		DANYANG: { default: 20, hint: '표준 20~25%' },
		IYANG:   { default: 15, hint: '표준 15~20%' },
		SAMYANG: { default: 10, hint: '표준 10~15%' }
	};

	const controller = new MakgeolliController();

	let totalRice = $state(1000);
	let riceForm = $state<RiceForm>('juk');
	let waterRatioPercent = $state(100);
	let nurukPercent = $state(15);
	let activeTab = $state<BrewTab>('IYANG');

	const showWaterRatio = $derived(riceForm !== 'tteok' && riceForm !== 'godubap');
	const showGodubap = $derived(activeTab === 'DANYANG');

	const result = $derived.by<MakgeolliResult | null>(() => {
		if (totalRice <= 0) return null;
		try {
			return controller.calculate({
				totalRiceGrams: totalRice,
				riceForm: TO_DOMAIN_RICE_FORM[riceForm],
				waterRatio: (waterRatioPercent || 100) / 100,
				nurukRatio: nurukPercent / 100,
				brewCount: BREW_COUNT[activeTab]
			});
		} catch {
			return null;
		}
	});

	function switchTab(tab: BrewTab) {
		activeTab = tab;
		nurukPercent = NURUK_CONFIG[tab].default;
		if (tab !== 'DANYANG' && riceForm === 'godubap') {
			riceForm = 'juk';
		}
	}
</script>

<div class="popup">
	<header>
		<img src="/logo.svg" alt="로고" class="logo" />
		<span class="title">알콜미터</span>
	</header>

	<div class="card">
		<div class="section-title">재료 입력</div>

		<div class="field">
			<label for="total-rice">쌀 총량 (g)</label>
			<input
				id="total-rice"
				type="number"
				min="100"
				step="100"
				bind:value={totalRice}
			/>
		</div>

		<div class="field">
			<label for="rice-form">쌀 형태</label>
			<select id="rice-form" bind:value={riceForm}>
				{#if showGodubap}
					<option value="godubap">{RICE_FORM_LABELS.godubap}</option>
				{/if}
				<option value="tteok">{RICE_FORM_LABELS.tteok}</option>
				<option value="beombuk">{RICE_FORM_LABELS.beombuk}</option>
				<option value="juk">{RICE_FORM_LABELS.juk}</option>
			</select>
		</div>

		{#if showWaterRatio}
			<div class="field">
				<label for="water-ratio">물 비율 (%)</label>
				<input
					id="water-ratio"
					type="number"
					min="1"
					max="300"
					step="1"
					bind:value={waterRatioPercent}
				/>
				<div class="hint">표준 100%</div>
				{#if waterRatioPercent < 95}
					<div class="note note-warm">전분이 많아 단맛이 강해집니다.</div>
				{:else if waterRatioPercent > 105}
					<div class="note note-cool">당도 낮고 도수가 낮아집니다.</div>
				{/if}
			</div>
		{/if}

		<div class="field">
			<label for="nuruk-percent">누룩 비율 (%)</label>
			<input
				id="nuruk-percent"
				type="number"
				min="1"
				max="50"
				step="1"
				bind:value={nurukPercent}
			/>
			<div class="hint">{NURUK_CONFIG[activeTab].hint}</div>
		</div>
	</div>

	{#if riceForm === 'tteok'}
		<div class="tteok-warning">
			떡(설기)은 발효가 더디거나 단맛이 극단적으로 강해질 수 있습니다. 초보자에게는 죽이나 범벅을 권장합니다.
		</div>
	{/if}

	<div class="card">
		<div class="section-title">배합 결과</div>

		<div class="tabs">
			<button
				class="tab"
				class:active={activeTab === 'DANYANG'}
				onclick={() => switchTab('DANYANG')}
			>단양주</button>
			<button
				class="tab"
				class:active={activeTab === 'IYANG'}
				onclick={() => switchTab('IYANG')}
			>이양주</button>
			<button
				class="tab"
				class:active={activeTab === 'SAMYANG'}
				onclick={() => switchTab('SAMYANG')}
			>삼양주</button>
		</div>

		{#if totalRice > 0 && result}
			<div class="table-wrap">
				<table>
					<thead>
						<tr>
							<th>단계</th>
							<th>쌀 (g)</th>
							<th>물 (g)</th>
							<th>누룩 (g)</th>
						</tr>
					</thead>
					<tbody>
						{#each result.stages as stage, i}
							<tr>
								<td>
									{STAGE_NAMES[result.brewCount][i]}
									<span class="badge">{RICE_FORM_LABELS[FROM_DOMAIN_RICE_FORM[stage.riceForm]]}</span>
								</td>
								<td>{Math.round(stage.riceGrams)}</td>
								<td>{stage.waterGrams === 0 ? '-' : Math.round(stage.waterGrams)}</td>
								<td>{stage.nurukGrams === 0 ? '-' : Math.round(stage.nurukGrams)}</td>
							</tr>
						{/each}
					</tbody>
					<tfoot>
						<tr>
							<td>합계</td>
							<td>{Math.round(result.totalRiceGrams)}</td>
							<td>{Math.round(result.totalWaterGrams)}</td>
							<td>{Math.round(result.totalNurukGrams)}</td>
						</tr>
					</tfoot>
				</table>
			</div>

			<div class="estimates">
				<div class="estimate-item">
					<span class="estimate-label">예상 도수</span>
					<strong>{result.estimates.alcoholPercent.toFixed(1)}%</strong>
				</div>
				<div class="estimate-item">
					<span class="estimate-label">예상 생산량</span>
					<strong>{Math.round(result.estimates.volumeLiters * 1000).toLocaleString()}g</strong>
				</div>
			</div>
		{:else}
			<div class="empty">쌀 총량을 입력해주세요.</div>
		{/if}
	</div>

	<footer>
		<span class="version">v{__APP_VERSION__}</span>
	</footer>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
		font-size: 14px;
		color: #111827;
		background: #f9fafb;
		width: 360px;
	}

	:global(input[type='number']::-webkit-inner-spin-button),
	:global(input[type='number']::-webkit-outer-spin-button) {
		-webkit-appearance: none;
		margin: 0;
	}

	:global(input[type='number']) {
		-moz-appearance: textfield;
	}

	.popup {
		width: 360px;
		padding: 12px;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	header {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 4px 0;
	}

	.logo {
		width: 28px;
		height: 28px;
	}

	.title {
		font-size: 18px;
		font-weight: 700;
		color: #111827;
	}

	.card {
		background: white;
		border: 2px solid #e5e7eb;
		border-radius: 12px;
		padding: 14px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.section-title {
		font-weight: 600;
		font-size: 13px;
		color: #6b7280;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		margin-bottom: 2px;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	label {
		font-size: 13px;
		font-weight: 500;
		color: #374151;
	}

	input[type='number'],
	select {
		width: 100%;
		box-sizing: border-box;
		padding: 7px 10px;
		border: 1.5px solid #e5e7eb;
		border-radius: 7px;
		font-size: 14px;
		color: #111827;
		background: white;
		outline: none;
		transition: border-color 0.15s;
	}

	input[type='number']:focus,
	select:focus {
		border-color: #2563eb;
	}

	.hint {
		font-size: 12px;
		color: #6b7280;
	}

	.note {
		font-size: 12px;
		padding: 5px 8px;
		border-radius: 6px;
	}

	.note-warm {
		background: #fff7ed;
		color: #c2410c;
	}

	.note-cool {
		background: #eff6ff;
		color: #1d4ed8;
	}

	.tteok-warning {
		background: #fefce8;
		border: 1.5px solid #fde047;
		border-radius: 10px;
		padding: 10px 12px;
		font-size: 13px;
		color: #713f12;
		line-height: 1.5;
	}

	.tabs {
		display: flex;
		gap: 6px;
	}

	.tab {
		flex: 1;
		padding: 7px 0;
		border: 1.5px solid #e5e7eb;
		border-radius: 8px;
		background: white;
		color: #6b7280;
		font-size: 13px;
		font-weight: 500;
		cursor: pointer;
		transition: background 0.15s, color 0.15s, border-color 0.15s;
	}

	.tab.active {
		background: #2563eb;
		color: white;
		border-color: #2563eb;
	}

	.table-wrap {
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 13px;
	}

	thead tr {
		background: #2563eb;
		color: white;
	}

	thead th {
		padding: 8px 10px;
		text-align: center;
		font-weight: 600;
	}

	thead th:first-child {
		text-align: left;
		border-radius: 8px 0 0 0;
	}

	thead th:last-child {
		border-radius: 0 8px 0 0;
	}

	tbody tr {
		border-bottom: 1px solid #e5e7eb;
	}

	tbody td {
		padding: 7px 10px;
		text-align: center;
		color: #111827;
	}

	tbody td:first-child {
		text-align: left;
	}

	.badge {
		display: inline-block;
		font-size: 10px;
		background: #eff6ff;
		color: #2563eb;
		border-radius: 4px;
		padding: 1px 5px;
		margin-left: 4px;
		vertical-align: middle;
	}

	tfoot tr {
		border-top: 2px solid #2563eb;
		background: rgba(37, 99, 235, 0.06);
	}

	tfoot td {
		padding: 8px 10px;
		text-align: center;
		font-weight: 600;
		color: #111827;
	}

	tfoot td:first-child {
		text-align: left;
	}

	.estimates {
		display: flex;
		border-top: 1px solid #e5e7eb;
	}

	.estimate-item {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 8px 4px 0;
		font-size: 13px;
		color: #374151;
	}

	.estimate-item + .estimate-item {
		border-left: 1px solid #e5e7eb;
		padding-left: 8px;
	}

	.estimate-label {
		color: #6b7280;
	}

	.estimate-item strong {
		font-size: 15px;
		color: #2563eb;
		white-space: nowrap;
	}

	.empty {
		text-align: center;
		color: #6b7280;
		padding: 20px 0;
		font-size: 13px;
	}

	footer {
		text-align: center;
		padding: 4px 0 2px;
	}

	.version {
		font-size: 10px;
		color: #9ca3af;
		opacity: 0.5;
	}
</style>
