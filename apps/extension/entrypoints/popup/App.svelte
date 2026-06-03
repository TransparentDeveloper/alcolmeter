<script lang="ts">
	declare const __APP_VERSION__: string;

	import {
		BrewingCalculator,
		BrewingStyle,
		RiceForm,
		Mass,
		Ratio,
		type RiceFormCode,
		type BrewingStyleCode,
		type BrewRecipe
	} from '@alcolmeter/domain/brewing';

	const RICE_FORM_LABELS: Record<RiceFormCode, string> = {
		godubap: '고두밥',
		tteok: '떡(설기)',
		beombuk: '범벅',
		juk: '죽'
	};

	const NURUK_CONFIG = {
		danyang: { default: 20, hint: '표준 20~25%' },
		iyang: { default: 15, hint: '표준 15~20%' },
		samyang: { default: 10, hint: '표준 10~15%' }
	};

	const calculator = new BrewingCalculator();

	let totalRice = $state(1000);
	let riceForm = $state<RiceFormCode>('juk');
	let waterRatioPercent = $state(100);
	let nurukPercent = $state(15);
	let activeStyle = $state<BrewingStyleCode>('iyang');

	const showWaterRatio = $derived(riceForm !== 'tteok' && riceForm !== 'godubap');
	const showGodubap = $derived(activeStyle === 'danyang');

	const result = $derived.by<BrewRecipe | null>(() => {
		if (totalRice <= 0) return null;
		try {
			return calculator.calculate({
				totalRice: Mass.of(totalRice),
				riceForm: RiceForm.fromCode(riceForm),
				waterRatio: Ratio.ofFraction((waterRatioPercent || 100) / 100),
				nurukRatio: Ratio.ofFraction(nurukPercent / 100),
				style: BrewingStyle.fromCode(activeStyle)
			});
		} catch {
			return null;
		}
	});

	function switchTab(style: BrewingStyleCode) {
		activeStyle = style;
		nurukPercent = NURUK_CONFIG[style].default;
		if (style !== 'danyang' && riceForm === 'godubap') {
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
			<div class="hint">{NURUK_CONFIG[activeStyle].hint}</div>
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
				class:active={activeStyle === 'danyang'}
				onclick={() => switchTab('danyang')}
			>단양주</button>
			<button
				class="tab"
				class:active={activeStyle === 'iyang'}
				onclick={() => switchTab('iyang')}
			>이양주</button>
			<button
				class="tab"
				class:active={activeStyle === 'samyang'}
				onclick={() => switchTab('samyang')}
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
						{#each result.stages as stage}
							<tr>
								<td>
									{stage.name}
									<span class="badge">{RICE_FORM_LABELS[stage.riceForm.code]}</span>
								</td>
								<td>{Math.round(stage.rice.grams)}</td>
								<td>{stage.water.grams === 0 ? '-' : Math.round(stage.water.grams)}</td>
								<td>{stage.nuruk.grams === 0 ? '-' : Math.round(stage.nuruk.grams)}</td>
							</tr>
						{/each}
					</tbody>
					<tfoot>
						<tr>
							<td>합계</td>
							<td>{Math.round(result.totals.rice.grams)}</td>
							<td>{Math.round(result.totals.water.grams)}</td>
							<td>{Math.round(result.totals.nuruk.grams)}</td>
						</tr>
					</tfoot>
				</table>
			</div>

			<div class="volume-line">
				<span class="volume-label">예상 생산량</span>
				<strong>
					{Math.round(result.totals.rice.grams * 0.3 + result.totals.water.grams).toLocaleString()}g
				</strong>
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

	.volume-line {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 8px 4px 0;
		font-size: 13px;
		color: #374151;
		border-top: 1px solid #e5e7eb;
	}

	.volume-label {
		color: #6b7280;
	}

	.volume-line strong {
		font-size: 15px;
		color: #2563eb;
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
