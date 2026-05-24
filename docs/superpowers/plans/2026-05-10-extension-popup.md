# Extension Popup Calculator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `apps/extension` 팝업을 도메인 라이브러리 기반 막걸리 배합 계산기로 구현한다.

**Architecture:** WXT(Chrome MV3) + Svelte 5 팝업. 계산 로직은 `@alcolmeter/domain`의 `MakgeolliController`에 위임하고, `App.svelte` 단일 컴포넌트가 전체 UI를 담당한다. 상태는 Svelte 5 `$state`/`$derived`로 관리하며, 입력 변경 시 `$derived`가 자동으로 도메인을 재호출한다.

**Tech Stack:** WXT 0.20, Svelte 5, @sveltejs/vite-plugin-svelte 7, @alcolmeter/domain (workspace)

---

## 파일 구조

| 파일 | 작업 | 역할 |
|---|---|---|
| `apps/extension/package.json` | 수정 | domain + Svelte 의존성 추가 |
| `apps/extension/wxt.config.ts` | 수정 | Svelte vite 플러그인 등록 |
| `apps/extension/tsconfig.json` | 수정 | .svelte 파일 include 추가 |
| `apps/extension/entrypoints/popup/index.html` | 수정 | Svelte 마운트 포인트 |
| `apps/extension/entrypoints/popup/main.ts` | 수정 | Svelte App 마운트 |
| `apps/extension/entrypoints/popup/App.svelte` | 생성 | 전체 팝업 UI + 상태 + 계산 |

---

## Task 1: 브랜치 생성

- [ ] **Step 1: main에서 extension-0.1.0 브랜치 생성**

```bash
git checkout main
git checkout -b extension-0.1.0
```

Expected: `Switched to a new branch 'extension-0.1.0'`

---

## Task 2: 의존성 & WXT Svelte 설정

**Files:**
- Modify: `apps/extension/package.json`
- Modify: `apps/extension/wxt.config.ts`
- Modify: `apps/extension/tsconfig.json`

- [ ] **Step 1: package.json에 의존성 추가**

`apps/extension/package.json`을 아래로 교체:

```json
{
	"name": "@alcolmeter/extension",
	"private": true,
	"version": "0.1.0",
	"type": "module",
	"scripts": {
		"dev": "wxt",
		"build": "wxt build",
		"zip": "wxt zip"
	},
	"dependencies": {
		"@alcolmeter/domain": "workspace:*"
	},
	"devDependencies": {
		"@sveltejs/vite-plugin-svelte": "^7.0.0",
		"svelte": "^5.0.0",
		"typescript": "^5.8.3",
		"wxt": "^0.20.25"
	}
}
```

- [ ] **Step 2: wxt.config.ts에 Svelte 플러그인 추가**

`apps/extension/wxt.config.ts`를 아래로 교체:

```ts
import { defineConfig } from 'wxt';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
	vite: () => ({ plugins: [svelte()] }),
	manifest: {
		name: 'Alcolmeter',
		description: '막걸리 배합 계산기',
		version: '0.1.0'
	}
});
```

- [ ] **Step 3: tsconfig.json에 Svelte 파일 포함**

`apps/extension/tsconfig.json`을 아래로 교체:

```json
{
	"compilerOptions": {
		"target": "ESNext",
		"module": "ESNext",
		"moduleResolution": "bundler",
		"strict": true,
		"lib": ["ESNext", "DOM"]
	},
	"include": [
		".wxt/wxt.d.ts",
		"entrypoints/**/*.ts",
		"entrypoints/**/*.svelte",
		"wxt.config.ts"
	]
}
```

- [ ] **Step 4: 루트에서 pnpm install**

```bash
# 프로젝트 루트에서
pnpm install
```

Expected: `@alcolmeter/domain`이 extension node_modules에 링크됨

- [ ] **Step 5: 커밋**

```bash
git add apps/extension/package.json apps/extension/wxt.config.ts apps/extension/tsconfig.json pnpm-lock.yaml
git commit -m "chore: extension에 Svelte 5 + domain 의존성 추가"
```

---

## Task 3: 팝업 진입점 수정 (index.html + main.ts)

**Files:**
- Modify: `apps/extension/entrypoints/popup/index.html`
- Modify: `apps/extension/entrypoints/popup/main.ts`

- [ ] **Step 1: index.html 교체**

`apps/extension/entrypoints/popup/index.html`을 아래로 교체:

```html
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Alcolmeter</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="./main.ts"></script>
  </body>
</html>
```

- [ ] **Step 2: main.ts 교체 (Svelte 5 mount)**

`apps/extension/entrypoints/popup/main.ts`를 아래로 교체:

```ts
import { mount } from 'svelte';
import App from './App.svelte';

mount(App, { target: document.getElementById('app')! });
```

- [ ] **Step 3: 커밋**

```bash
git add apps/extension/entrypoints/popup/index.html apps/extension/entrypoints/popup/main.ts
git commit -m "chore: extension 팝업 진입점을 Svelte 마운트 방식으로 전환"
```

---

## Task 4: App.svelte 구현

**Files:**
- Create: `apps/extension/entrypoints/popup/App.svelte`

- [ ] **Step 1: App.svelte 생성**

`apps/extension/entrypoints/popup/App.svelte`를 아래 내용으로 생성:

```svelte
<script lang="ts">
	import { MakgeolliController } from '@alcolmeter/domain/makgeolli';
	import type { MakgeolliResult } from '@alcolmeter/domain/makgeolli';

	type RiceFormCode = 'GODUBAP' | 'TTEOK' | 'BEOMBUK' | 'JUK';
	type TabKey = 'DANYANG' | 'IYANG' | 'SAMYANG';

	const NURUK_CONFIG: Record<TabKey, { default: number; hint: string }> = {
		DANYANG: { default: 20, hint: '표준 20~25%' },
		IYANG:   { default: 15, hint: '표준 15~20%' },
		SAMYANG: { default: 10, hint: '표준 10~15%' }
	};

	const RICE_FORM_LABELS: Record<RiceFormCode, string> = {
		GODUBAP: '고두밥',
		TTEOK:   '떡(설기)',
		BEOMBUK: '범벅',
		JUK:     '죽'
	};

	const STAGE_NAMES: Record<1 | 2 | 3, string[]> = {
		1: ['전량 투입'],
		2: ['밑술', '덧술'],
		3: ['밑술', '덧술', '덧술2']
	};

	const TABS: { id: TabKey; label: string; brewCount: 1 | 2 | 3 }[] = [
		{ id: 'DANYANG', label: '단양주', brewCount: 1 },
		{ id: 'IYANG',   label: '이양주', brewCount: 2 },
		{ id: 'SAMYANG', label: '삼양주', brewCount: 3 }
	];

	const controller = new MakgeolliController();

	let totalRice = $state(1000);
	let riceForm = $state<RiceFormCode>('JUK');
	let waterRatioPercent = $state(100);
	let nurukRatio = $state(15);
	let activeTab = $state<TabKey>('IYANG');

	const activeBrewCount = $derived(TABS.find(t => t.id === activeTab)!.brewCount);
	const showGodubap = $derived(activeTab === 'DANYANG');
	const showWaterRatio = $derived(riceForm !== 'TTEOK' && riceForm !== 'GODUBAP');
	const nurukConfig = $derived(NURUK_CONFIG[activeTab]);

	const result = $derived.by((): MakgeolliResult | null => {
		if (totalRice <= 0) return null;
		return controller.calculate({
			totalRiceGrams: totalRice,
			riceForm,
			waterRatio: waterRatioPercent / 100,
			nurukRatio: nurukRatio / 100,
			brewCount: activeBrewCount
		});
	});

	const stageNames = $derived(STAGE_NAMES[activeBrewCount]);

	const estimatedVolumeG = $derived(
		result ? Math.round(result.totalRiceGrams * 0.3 + result.totalWaterGrams) : 0
	);

	function switchTab(tab: TabKey) {
		activeTab = tab;
		nurukRatio = NURUK_CONFIG[tab].default;
		if (tab !== 'DANYANG' && riceForm === 'GODUBAP') {
			riceForm = 'JUK';
		}
	}

	function fmtG(grams: number): string {
		if (grams <= 0) return '-';
		return Math.round(grams).toString();
	}
</script>

<div class="popup">
	<!-- 헤더 -->
	<header class="header">
		<img src="/logo.svg" alt="알콜미터" class="logo" />
		<span class="title">알콜미터</span>
	</header>

	<!-- 재료 입력 -->
	<section class="card">
		<h2 class="card-title">재료 입력</h2>

		<div class="field">
			<label for="total-rice">쌀 총량 (g)</label>
			<input
				id="total-rice"
				type="number"
				min="100"
				step="100"
				placeholder="1000"
				bind:value={totalRice}
			/>
		</div>

		<div class="field">
			<label for="rice-form">쌀 형태</label>
			<select id="rice-form" bind:value={riceForm}>
				{#if showGodubap}
					<option value="GODUBAP">{RICE_FORM_LABELS.GODUBAP}</option>
				{/if}
				<option value="TTEOK">{RICE_FORM_LABELS.TTEOK}</option>
				<option value="BEOMBUK">{RICE_FORM_LABELS.BEOMBUK}</option>
				<option value="JUK">{RICE_FORM_LABELS.JUK}</option>
			</select>
		</div>

		{#if showWaterRatio}
			<div class="field">
				<label for="water-ratio">물 비율 (%)</label>
				{#if waterRatioPercent < 95}
					<p class="note note--warm">전분이 많아 단맛이 강해집니다.</p>
				{:else if waterRatioPercent > 105}
					<p class="note note--cool">당도 낮고 도수가 낮아집니다.</p>
				{/if}
				<div class="input-hint-wrap">
					<input
						id="water-ratio"
						type="number"
						min="0"
						max="500"
						step="10"
						bind:value={waterRatioPercent}
					/>
					<span class="hint">표준 100%</span>
				</div>
			</div>
		{/if}

		<div class="field">
			<label for="nuruk-ratio">누룩 비율 (%)</label>
			<div class="input-hint-wrap">
				<input
					id="nuruk-ratio"
					type="number"
					min="1"
					max="50"
					step="1"
					bind:value={nurukRatio}
				/>
				<span class="hint">{nurukConfig.hint}</span>
			</div>
		</div>
	</section>

	<!-- 떡 경고 -->
	{#if riceForm === 'TTEOK'}
		<p class="tteok-warning">
			떡(설기)은 발효가 더디거나 단맛이 극단적으로 강해질 수 있습니다. 초보자에게는 죽이나 범벅을 권장합니다.
		</p>
	{/if}

	<!-- 배합 결과 -->
	<section class="card">
		<h2 class="card-title">배합 결과</h2>

		<nav class="tabs">
			{#each TABS as tab}
				<button
					class="tab"
					class:active={activeTab === tab.id}
					onclick={() => switchTab(tab.id)}
				>
					{tab.label}
				</button>
			{/each}
		</nav>

		{#if result}
			<table class="result-table">
				<thead>
					<tr>
						<th class="col-stage">단계</th>
						<th>쌀 (g)</th>
						<th>물 (g)</th>
						<th>누룩 (g)</th>
					</tr>
				</thead>
				<tbody>
					{#each result.stages as stage, i}
						<tr>
							<td class="stage-name">
								{stageNames[i]}
								<span class="rice-form-badge">{RICE_FORM_LABELS[stage.riceForm as RiceFormCode]}</span>
							</td>
							<td>{fmtG(stage.riceGrams)}</td>
							<td>{fmtG(stage.waterGrams)}</td>
							<td>{fmtG(stage.nurukGrams)}</td>
						</tr>
					{/each}
				</tbody>
				<tfoot>
					<tr>
						<td class="stage-name">합계</td>
						<td>{fmtG(result.totalRiceGrams)}</td>
						<td>{fmtG(result.totalWaterGrams)}</td>
						<td>{fmtG(result.totalNurukGrams)}</td>
					</tr>
				</tfoot>
			</table>

			<p class="estimated">
				예상 생산량 <strong>{estimatedVolumeG.toLocaleString()}g</strong>
			</p>
		{:else}
			<p class="empty">쌀 총량을 입력해주세요.</p>
		{/if}
	</section>
</div>

<style>
	:global(*) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	:global(body) {
		width: 360px;
		min-height: 100px;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans KR', sans-serif;
		background: #f9fafb;
		color: #111827;
		font-size: 14px;
		line-height: 1.5;
	}

	.popup {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 0.875rem;
	}

	/* 헤더 */
	.header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.25rem 0;
	}

	.logo {
		width: 24px;
		height: 24px;
	}

	.title {
		font-size: 1rem;
		font-weight: 800;
		letter-spacing: -0.02em;
		color: #111827;
	}

	/* 카드 */
	.card {
		background: #ffffff;
		border-radius: 12px;
		padding: 1rem;
		border: 2px solid #e5e7eb;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.card-title {
		font-size: 0.78rem;
		font-weight: 800;
		color: #111827;
		letter-spacing: -0.01em;
	}

	/* 필드 */
	.field {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	label {
		font-size: 0.75rem;
		font-weight: 700;
		color: #374151;
	}

	input[type='number'],
	select {
		width: 100%;
		padding: 0.5rem 0.625rem;
		border: 2px solid #d1d5db;
		border-radius: 8px;
		font-size: 0.875rem;
		font-weight: 700;
		font-family: inherit;
		background: #ffffff;
		color: #111827;
	}

	input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
	}

	input[type='number'] {
		-moz-appearance: textfield;
	}

	input:focus,
	select:focus {
		outline: none;
		border-color: #2563eb;
	}

	.input-hint-wrap {
		position: relative;
	}

	.input-hint-wrap input {
		padding-right: 6.5rem;
	}

	.hint {
		position: absolute;
		right: 0.625rem;
		top: 50%;
		transform: translateY(-50%);
		font-size: 0.68rem;
		font-weight: 700;
		color: #6b7280;
		pointer-events: none;
	}

	/* 노트 */
	.note {
		font-size: 0.7rem;
		font-weight: 700;
	}

	.note--warm { color: #92400e; }
	.note--cool { color: #2563eb; }

	/* 떡 경고 */
	.tteok-warning {
		padding: 0.625rem 0.75rem;
		background: #fef3c7;
		border: 2px solid #f59e0b;
		border-radius: 8px;
		font-size: 0.72rem;
		font-weight: 700;
		color: #92400e;
		line-height: 1.5;
	}

	/* 탭 */
	.tabs {
		display: flex;
		gap: 0.375rem;
	}

	.tab {
		flex: 1;
		padding: 0.4rem 0;
		background: #f3f4f6;
		border: 2px solid #d1d5db;
		border-radius: 6px;
		font-size: 0.75rem;
		font-weight: 700;
		font-family: inherit;
		color: #6b7280;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.tab.active {
		background: #2563eb;
		border-color: #2563eb;
		color: #ffffff;
	}

	/* 결과 테이블 */
	.result-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.78rem;
	}

	.result-table th,
	.result-table td {
		padding: 0.5rem 0.375rem;
		text-align: center;
		border-bottom: 1.5px solid #e5e7eb;
		font-weight: 700;
	}

	.result-table th {
		background: #2563eb;
		color: #ffffff;
		font-size: 0.7rem;
	}

	.col-stage { width: 36%; }

	.result-table th:first-child,
	.result-table td.stage-name {
		text-align: left;
		padding-left: 0.5rem;
	}

	.rice-form-badge {
		font-size: 0.6rem;
		font-weight: 400;
		color: #6b7280;
		margin-left: 0.25rem;
	}

	.result-table tfoot td {
		font-weight: 800;
		border-top: 2px solid #2563eb;
		background: rgba(37, 99, 235, 0.06);
		border-bottom: none;
	}

	/* 예상 생산량 */
	.estimated {
		font-size: 0.78rem;
		font-weight: 700;
		color: #374151;
		padding-top: 0.25rem;
		border-top: 1.5px solid #e5e7eb;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.estimated strong {
		font-size: 0.9rem;
		color: #2563eb;
	}

	/* 빈 상태 */
	.empty {
		text-align: center;
		color: #6b7280;
		padding: 1.25rem;
		font-size: 0.8rem;
	}
</style>
```

- [ ] **Step 2: 빌드 확인**

```bash
pnpm --filter @alcolmeter/extension build
```

Expected: `.output/chrome-mv3/` 디렉토리 생성, 에러 없음.

오류 발생 시 확인 사항:
- `Cannot find module '@alcolmeter/domain/makgeolli'` → `pnpm install` 재실행
- Svelte 관련 오류 → `wxt.config.ts`의 `vite: () => ...` 형식 확인 (함수 형태여야 함)

- [ ] **Step 3: 커밋**

```bash
git add apps/extension/entrypoints/popup/App.svelte
git commit -m "feat: 막걸리 배합 계산기 팝업 구현"
```

---

## Task 5: Chrome에서 수동 검증

- [ ] **Step 1: Chrome 확장프로그램 로드**

1. Chrome → `chrome://extensions/` 접속
2. 우측 상단 "개발자 모드" 활성화
3. "압축해제된 확장 프로그램을 로드합니다" 클릭
4. `.output/chrome-mv3/` 폴더 선택

- [ ] **Step 2: 기본 동작 확인**

팝업 열고 아래 시나리오 순서대로 확인:

| 시나리오 | 입력 | 기대 결과 |
|---|---|---|
| 기본 상태 | 쌀 1000g, 죽, 이양주 | 결과 테이블 표시, 밑술+덧술 2행 |
| 쌀 0g | totalRice=0 | "쌀 총량을 입력해주세요" 표시 |
| 떡 선택 | riceForm=떡 | 경고 메시지 표시, 물 비율 입력 숨김 |
| 고두밥 선택 | 단양주 탭에서 고두밥 선택 | 물 비율 입력 숨김 |
| 탭 전환 | 이양주→삼양주 | 누룩 비율 15→10 자동 변경, 덧술 3행 표시 |
| 단양주→이양주 전환 중 고두밥 | 단양주+고두밥 → 이양주 클릭 | riceForm이 죽으로 자동 변경 |
| 누룩 직접 수정 | nurukRatio=25 입력 후 탭 전환 | 탭 전환 시 다시 기본값으로 리셋됨 (웹앱과 동일 동작) |

- [ ] **Step 3: 결과값 교차 검증**

웹앱(https://alcolmeter.vercel.app/makgeolli)에서 동일 입력값으로 결과 비교. 쌀·물·누룩 합계가 일치해야 한다.

---

## Task 6: 최종 커밋 확인

- [ ] **Step 1: 커밋 이력 확인**

```bash
git log --oneline extension-0.1.0 ^main
```

Expected (순서대로):
```
feat: 막걸리 배합 계산기 팝업 구현
chore: extension 팝업 진입점을 Svelte 마운트 방식으로 전환
chore: extension에 Svelte 5 + domain 의존성 추가
```
