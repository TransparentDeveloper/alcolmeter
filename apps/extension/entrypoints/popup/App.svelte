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
	/*
	 * 디자인시스템(@alcolmeter/design-system) 토큰 적용 — Measurement Notebook.
	 * 색·보더·radius·shadow·간격·모션·폰트는 전부 --ds-* 토큰. 다크모드는 토큰이
	 * prefers-color-scheme로 자동 전환한다(팝업엔 토글 UI 없음).
	 * 타입스케일: 360px 팝업이라 web 본문(base 19.2px)은 과해 xs(14.4)를 기준으로 쓰고,
	 * 배지·버전 같은 마이크로 텍스트만 스케일 아래 px를 유지한다.
	 */
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: var(--ds-font-sans);
		font-size: var(--ds-text-xs);
		line-height: var(--ds-leading-normal);
		color: var(--ds-color-ink-1);
		background: var(--ds-color-bg);
		width: 360px;
		color-scheme: light dark; /* 네이티브 컨트롤(number 스피너·select)도 테마 추적 */
		-webkit-font-smoothing: antialiased;
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
		padding: var(--ds-space-md);
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		gap: var(--ds-space-md);
	}

	header {
		display: flex;
		align-items: center;
		gap: var(--ds-space-sm);
		padding: var(--ds-space-xs) 0;
	}

	.logo {
		width: 28px;
		height: 28px;
	}

	.title {
		font-family: var(--ds-font-display);
		font-size: var(--ds-text-base);
		font-weight: var(--ds-weight-bold);
		letter-spacing: var(--ds-tracking-tight);
		color: var(--ds-color-ink-1);
	}

	.card {
		background: var(--ds-color-surface);
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		border-radius: var(--ds-radius-lg);
		box-shadow: var(--ds-shadow-paper);
		padding: var(--ds-space-lg);
		display: flex;
		flex-direction: column;
		gap: var(--ds-space-sm);
	}

	.section-title {
		font-family: var(--ds-font-mono);
		font-weight: var(--ds-weight-medium);
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-3);
		text-transform: uppercase;
		letter-spacing: 0.08em;
		margin-bottom: var(--ds-space-2xs);
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: var(--ds-space-xs);
	}

	label {
		font-size: var(--ds-text-xs);
		font-weight: var(--ds-weight-medium);
		color: var(--ds-color-ink-2);
	}

	input[type='number'],
	select {
		width: 100%;
		box-sizing: border-box;
		padding: var(--ds-space-sm) var(--ds-space-md);
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		border-radius: var(--ds-radius-md);
		font-size: var(--ds-text-xs);
		font-family: var(--ds-font-sans);
		color: var(--ds-color-ink-1);
		background: var(--ds-color-surface);
		outline: none;
		transition: border-color var(--ds-duration-short) var(--ds-ease-out);
	}

	input[type='number']:focus,
	select:focus {
		border-color: var(--ds-color-focus);
	}

	.hint {
		font-size: 12px;
		color: var(--ds-color-ink-3);
	}

	.note {
		font-size: 12px;
		padding: var(--ds-space-xs) var(--ds-space-sm);
		border-radius: var(--ds-radius-sm);
		background: var(--ds-color-bg);
		color: var(--ds-color-ink-2);
	}

	.note-warm {
		border-left: 3px solid var(--ds-color-warning);
	}

	.note-cool {
		border-left: 3px solid var(--ds-color-info);
	}

	.tteok-warning {
		background: var(--ds-color-surface);
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		border-left: 3px solid var(--ds-color-warning);
		border-radius: var(--ds-radius-sm);
		padding: var(--ds-space-md);
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-1);
		line-height: var(--ds-leading-snug);
	}

	.tabs {
		display: flex;
		gap: var(--ds-space-sm);
	}

	.tab {
		flex: 1;
		padding: var(--ds-space-sm) 0;
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		border-radius: var(--ds-radius-md);
		background: var(--ds-color-surface);
		color: var(--ds-color-ink-2);
		font-size: var(--ds-text-xs);
		font-weight: var(--ds-weight-medium);
		font-family: var(--ds-font-sans);
		cursor: pointer;
		transition: background-color var(--ds-duration-short) var(--ds-ease-out),
			color var(--ds-duration-short) var(--ds-ease-out),
			border-color var(--ds-duration-short) var(--ds-ease-out);
	}

	.tab:hover:not(.active) {
		border-color: var(--ds-color-border-3);
		color: var(--ds-color-ink-1);
	}

	.tab.active {
		background: var(--ds-color-action);
		color: var(--ds-color-on-action);
		border-color: var(--ds-color-action);
	}

	.table-wrap {
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: var(--ds-text-xs);
	}

	thead th {
		padding: var(--ds-space-sm) var(--ds-space-md);
		text-align: center;
		font-family: var(--ds-font-mono);
		font-weight: var(--ds-weight-medium);
		font-size: 12px;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--ds-color-ink-3);
		border-bottom: var(--ds-border-width) solid var(--ds-color-border-2);
	}

	thead th:first-child {
		text-align: left;
	}

	tbody tr {
		border-bottom: var(--ds-border-width) solid var(--ds-color-border-1);
	}

	tbody td {
		padding: var(--ds-space-sm) var(--ds-space-md);
		text-align: center;
		color: var(--ds-color-ink-1);
	}

	tbody td:first-child {
		text-align: left;
	}

	.badge {
		display: inline-block;
		font-family: var(--ds-font-mono);
		font-size: 10px;
		background: var(--ds-color-bg);
		border: var(--ds-border-width) solid var(--ds-color-border-1);
		color: var(--ds-color-ink-3);
		border-radius: var(--ds-radius-xs);
		padding: 1px 5px;
		margin-left: var(--ds-space-xs);
		vertical-align: middle;
	}

	tfoot tr {
		border-top: var(--ds-border-width) solid var(--ds-color-border-3);
	}

	tfoot td {
		padding: var(--ds-space-sm) var(--ds-space-md);
		text-align: center;
		font-weight: var(--ds-weight-semibold);
		color: var(--ds-color-ink-1);
	}

	tfoot td:first-child {
		text-align: left;
	}

	.estimates {
		display: flex;
		border-top: var(--ds-border-width) solid var(--ds-color-border-1);
	}

	.estimate-item {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--ds-space-sm) var(--ds-space-xs) 0;
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-2);
	}

	.estimate-item + .estimate-item {
		border-left: var(--ds-border-width) solid var(--ds-color-border-1);
		padding-left: var(--ds-space-sm);
	}

	.estimate-label {
		color: var(--ds-color-ink-3);
	}

	.estimate-item strong {
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-sm);
		font-weight: var(--ds-weight-semibold);
		color: var(--ds-color-accent);
		white-space: nowrap;
	}

	.empty {
		text-align: center;
		font-family: var(--ds-font-mono);
		color: var(--ds-color-ink-3);
		padding: var(--ds-space-xl) 0;
		font-size: var(--ds-text-xs);
	}

	footer {
		text-align: center;
		padding: var(--ds-space-xs) 0 var(--ds-space-2xs);
	}

	.version {
		font-size: 10px;
		color: var(--ds-color-ink-4);
	}
</style>
