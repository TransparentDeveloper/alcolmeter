# Alcolmeter MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a server-free makgeolli brewing calculator that takes rice amount + rice form as input and outputs ideal water/nuruk ratios for danyang/iyang/samyang-ju.

**Architecture:** SvelteKit SPA with adapter-static for Vercel deployment. Pure client-side calculation logic separated from UI components. Data layer holds nuruk specs for future extensibility.

**Tech Stack:** SvelteKit 2, Svelte 5, TypeScript, Vitest, adapter-static, Vercel

---

## File Structure

```
~/projects/alcolmeter/
├── src/
│   ├── app.html                           # HTML shell
│   ├── app.css                            # Global styles
│   ├── routes/
│   │   ├── +layout.svelte                 # Shared layout (header/footer)
│   │   ├── +page.svelte                   # Main: 술 종류 선택
│   │   └── makgeolli/
│   │       └── +page.svelte               # 막걸리 계산기
│   └── lib/
│       ├── types.ts                       # Shared types (RiceForm, BrewStage, BrewResult)
│       ├── calculator/
│       │   └── makgeolli.ts               # 배합 계산 로직
│       ├── data/
│       │   └── nuruk.ts                   # 누룩 종류 & 당화력 데이터
│       └── components/
│           ├── IngredientInput.svelte      # 재료 입력 폼
│           └── ResultTable.svelte          # 결과 테이블
├── tests/
│   └── calculator/
│       └── makgeolli.test.ts              # 계산 로직 단위 테스트
├── static/
│   └── favicon.png
├── svelte.config.js
├── vite.config.ts
├── tsconfig.json
├── package.json
└── docs/
```

**Responsibilities:**
- `src/lib/types.ts` — All TypeScript types/interfaces shared across calculator and UI
- `src/lib/data/nuruk.ts` — Nuruk type catalog with saccharification power values (extensible)
- `src/lib/calculator/makgeolli.ts` — Pure functions: takes rice amount + form, returns stage-by-stage breakdown for all 3 brew types
- `src/lib/components/IngredientInput.svelte` — Input form: rice amount (number) + rice form (select)
- `src/lib/components/ResultTable.svelte` — Renders one brew type's stage breakdown as a table
- `src/routes/+page.svelte` — Landing page with drink type selection cards
- `src/routes/makgeolli/+page.svelte` — Makgeolli calculator page: wires input to calculator to result tabs
- `tests/calculator/makgeolli.test.ts` — Unit tests for all calculation logic

---

### Task 1: SvelteKit Project Scaffolding

**Files:**
- Create: `package.json`, `svelte.config.js`, `vite.config.ts`, `tsconfig.json`, `src/app.html`, `src/app.css`, `src/routes/+layout.svelte`, `src/routes/+page.svelte`

- [ ] **Step 1: Scaffold SvelteKit project**

Run:
```bash
cd ~/projects/alcolmeter
npx sv create . --template minimal --types ts --no-add-ons --no-install
```

If prompted about existing files, allow overwrite (only `docs/` exists).

- [ ] **Step 2: Install dependencies**

Run:
```bash
cd ~/projects/alcolmeter
npm install
npm install -D @sveltejs/adapter-static
```

- [ ] **Step 3: Configure adapter-static**

Replace `svelte.config.js`:

```js
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',
			precompress: false,
			strict: true
		})
	},
	preprocess: vitePreprocess()
};

export default config;
```

- [ ] **Step 4: Add prerender config to layout**

Create `src/routes/+layout.ts`:

```ts
export const prerender = true;
export const ssr = false;
```

- [ ] **Step 5: Add Vitest config**

Update `vite.config.ts`:

```ts
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['tests/**/*.test.ts']
	}
});
```

Install vitest:
```bash
cd ~/projects/alcolmeter
npm install -D vitest
```

- [ ] **Step 6: Add global styles**

Create `src/app.css`:

```css
:root {
	--color-primary: #2563eb;
	--color-bg: #f8fafc;
	--color-text: #1e293b;
	--color-muted: #64748b;
	--color-border: #e2e8f0;
	--color-card: #ffffff;
	--color-accent: #eab308;
	--max-width: 960px;
}

* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

body {
	font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
	background: var(--color-bg);
	color: var(--color-text);
	line-height: 1.6;
}
```

- [ ] **Step 7: Set up layout**

Replace `src/routes/+layout.svelte`:

```svelte
<script>
	import '../app.css';
	let { children } = $props();
</script>

<div class="app">
	<header>
		<a href="/" class="logo">알콜미터</a>
		<span class="version">v0.1.0</span>
	</header>
	<main>
		{@render children()}
	</main>
</div>

<style>
	.app {
		max-width: var(--max-width);
		margin: 0 auto;
		padding: 1rem;
	}

	header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem 0;
		border-bottom: 1px solid var(--color-border);
		margin-bottom: 2rem;
	}

	.logo {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-primary);
		text-decoration: none;
	}

	.version {
		font-size: 0.75rem;
		color: var(--color-muted);
	}
</style>
```

- [ ] **Step 8: Verify dev server starts**

Run:
```bash
cd ~/projects/alcolmeter
npm run dev -- --port 5173
```

Expected: Dev server starts at `http://localhost:5173`, shows "알콜미터" header.

- [ ] **Step 9: Commit**

```bash
cd ~/projects/alcolmeter
echo "node_modules\n.svelte-kit\nbuild" > .gitignore
git add -A
git commit -m "chore: scaffold SvelteKit project with adapter-static and vitest"
```

---

### Task 2: Types and Nuruk Data

**Files:**
- Create: `src/lib/types.ts`, `src/lib/data/nuruk.ts`

- [ ] **Step 1: Define shared types**

Create `src/lib/types.ts`:

```ts
/** 쌀 가공 형태 */
export type RiceForm = 'tteok' | 'beombuk' | 'juk';

/** 쌀 형태 한글 라벨 */
export const RICE_FORM_LABELS: Record<RiceForm, string> = {
	tteok: '떡 (설기)',
	beombuk: '범벅',
	juk: '죽'
};

/** 쌀 형태별 쌀:물 비율 (쌀 1 기준 물의 비율) */
export const RICE_WATER_RATIO: Record<RiceForm, number> = {
	tteok: 1,
	beombuk: 3,
	juk: 5
};

/** 양조 단계 */
export interface BrewStage {
	name: string;
	rice: number;
	water: number;
	nuruk: number;
}

/** 양조 유형별 결과 */
export interface BrewResult {
	type: 'danyang' | 'iyang' | 'samyang';
	label: string;
	stages: BrewStage[];
	totalRice: number;
	totalWater: number;
	totalNuruk: number;
}

/** 누룩 종류 */
export interface NurukType {
	id: string;
	name: string;
	saccharificationPower: number; // SP
	/** 밑술 쌀 대비 누룩 투입 비율 (0.1 = 10%) */
	riceRatio: number;
}
```

- [ ] **Step 2: Create nuruk data**

Create `src/lib/data/nuruk.ts`:

```ts
import type { NurukType } from '$lib/types';

export const NURUK_TYPES: NurukType[] = [
	{
		id: 'songhak',
		name: '송학곡자',
		saccharificationPower: 300,
		riceRatio: 0.1
	}
];

/** MVP: 송학곡자 고정 */
export const DEFAULT_NURUK = NURUK_TYPES[0];
```

- [ ] **Step 3: Commit**

```bash
cd ~/projects/alcolmeter
git add src/lib/types.ts src/lib/data/nuruk.ts
git commit -m "feat: add brewing types and nuruk data"
```

---

### Task 3: Makgeolli Calculator Logic (TDD)

**Files:**
- Create: `src/lib/calculator/makgeolli.ts`, `tests/calculator/makgeolli.test.ts`

- [ ] **Step 1: Write failing tests for danyang-ju**

Create `tests/calculator/makgeolli.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { calculateDanyang, calculateIyang, calculateSamyang } from '$lib/calculator/makgeolli';
import type { RiceForm } from '$lib/types';

describe('calculateDanyang', () => {
	it('떡 형태로 쌀 6ℓ 단양주 계산', () => {
		const result = calculateDanyang(6, 'tteok');

		expect(result.type).toBe('danyang');
		expect(result.stages).toHaveLength(1);

		const stage = result.stages[0];
		expect(stage.name).toBe('전량 투입');
		expect(stage.rice).toBe(6);
		expect(stage.water).toBe(6);     // 떡 1:1, 쌀 6 * 1 = 6
		expect(stage.nuruk).toBeCloseTo(0.6); // 쌀 6의 10% = 0.6
	});

	it('죽 형태로 쌀 3ℓ 단양주 계산', () => {
		const result = calculateDanyang(3, 'juk');

		const stage = result.stages[0];
		expect(stage.rice).toBe(3);
		expect(stage.water).toBe(15);    // 죽 1:5, 쌀 3 * 5 = 15
		expect(stage.nuruk).toBeCloseTo(0.3);
	});
});

describe('calculateIyang', () => {
	it('떡 형태로 쌀 6ℓ 이양주 계산', () => {
		const result = calculateIyang(6, 'tteok');

		expect(result.type).toBe('iyang');
		expect(result.stages).toHaveLength(2);

		const [milsul, deotsul] = result.stages;

		// 밑술: 쌀 1/3 = 2, 물 = 2*1 = 2, 누룩 전량
		expect(milsul.name).toBe('밑술');
		expect(milsul.rice).toBe(2);
		expect(milsul.water).toBe(2);
		expect(milsul.nuruk).toBeCloseTo(0.2); // 밑술 쌀 2의 10%

		// 덧술: 쌀 2/3 = 4, 물 없음, 누룩 없음
		expect(deotsul.name).toBe('덧술');
		expect(deotsul.rice).toBe(4);
		expect(deotsul.water).toBe(0);
		expect(deotsul.nuruk).toBe(0);
	});

	it('범벅 형태로 쌀 3ℓ 이양주 계산', () => {
		const result = calculateIyang(3, 'beombuk');

		const [milsul, deotsul] = result.stages;

		// 밑술: 쌀 1/3 = 1, 물 = 1*3 = 3
		expect(milsul.rice).toBe(1);
		expect(milsul.water).toBe(3);
		expect(milsul.nuruk).toBeCloseTo(0.1);

		// 덧술: 쌀 2/3 = 2, 물 없음
		expect(deotsul.rice).toBe(2);
		expect(deotsul.water).toBe(0);
	});
});

describe('calculateSamyang', () => {
	it('떡 형태로 쌀 6ℓ 삼양주 계산', () => {
		const result = calculateSamyang(6, 'tteok');

		expect(result.type).toBe('samyang');
		expect(result.stages).toHaveLength(3);

		const [milsul, deotsul1, deotsul2] = result.stages;

		// 밑술: 쌀 1/6 = 1, 물 = 1*1 = 1, 누룩 전량
		expect(milsul.name).toBe('밑술');
		expect(milsul.rice).toBe(1);
		expect(milsul.water).toBe(1);
		expect(milsul.nuruk).toBeCloseTo(0.1); // 밑술 쌀 1의 10%

		// 덧술: 쌀 1/6 = 1, 물 = 1*1 = 1 (밑술과 동일 형태), 누룩 없음
		expect(deotsul1.name).toBe('덧술');
		expect(deotsul1.rice).toBe(1);
		expect(deotsul1.water).toBe(1);
		expect(deotsul1.nuruk).toBe(0);

		// 덧술2: 쌀 4/6 = 4, 물 없음, 누룩 없음
		expect(deotsul2.name).toBe('덧술2');
		expect(deotsul2.rice).toBe(4);
		expect(deotsul2.water).toBe(0);
		expect(deotsul2.nuruk).toBe(0);
	});

	it('죽 형태로 쌀 6ℓ 삼양주 계산', () => {
		const result = calculateSamyang(6, 'juk');

		const [milsul, deotsul1, deotsul2] = result.stages;

		// 밑술: 쌀 1, 물 = 1*5 = 5
		expect(milsul.water).toBe(5);
		// 덧술: 쌀 1, 물 = 1*5 = 5 (동일 형태)
		expect(deotsul1.water).toBe(5);
		// 덧술2: 물 없음
		expect(deotsul2.water).toBe(0);
	});
});

describe('totals', () => {
	it('이양주 총합이 정확함', () => {
		const result = calculateIyang(6, 'tteok');

		expect(result.totalRice).toBe(6);
		expect(result.totalWater).toBe(2); // 밑술 물만
		expect(result.totalNuruk).toBeCloseTo(0.2);
	});

	it('삼양주 총합이 정확함', () => {
		const result = calculateSamyang(6, 'tteok');

		expect(result.totalRice).toBe(6);
		expect(result.totalWater).toBe(2); // 밑술 1 + 덧술 1
		expect(result.totalNuruk).toBeCloseTo(0.1);
	});
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run:
```bash
cd ~/projects/alcolmeter
npx vitest run
```

Expected: FAIL — cannot find module `$lib/calculator/makgeolli`

- [ ] **Step 3: Implement calculator**

Create `src/lib/calculator/makgeolli.ts`:

```ts
import { RICE_WATER_RATIO, type RiceForm, type BrewResult, type BrewStage } from '$lib/types';
import { DEFAULT_NURUK } from '$lib/data/nuruk';

function waterForRice(rice: number, form: RiceForm): number {
	return rice * RICE_WATER_RATIO[form];
}

function nurukForRice(rice: number): number {
	return rice * DEFAULT_NURUK.riceRatio;
}

function sumStages(stages: BrewStage[]): { totalRice: number; totalWater: number; totalNuruk: number } {
	return stages.reduce(
		(acc, s) => ({
			totalRice: acc.totalRice + s.rice,
			totalWater: acc.totalWater + s.water,
			totalNuruk: acc.totalNuruk + s.nuruk
		}),
		{ totalRice: 0, totalWater: 0, totalNuruk: 0 }
	);
}

export function calculateDanyang(totalRice: number, riceForm: RiceForm): BrewResult {
	const stages: BrewStage[] = [
		{
			name: '전량 투입',
			rice: totalRice,
			water: waterForRice(totalRice, riceForm),
			nuruk: nurukForRice(totalRice)
		}
	];

	return {
		type: 'danyang',
		label: '단양주',
		stages,
		...sumStages(stages)
	};
}

export function calculateIyang(totalRice: number, riceForm: RiceForm): BrewResult {
	const milsulRice = totalRice / 3;
	const deotsulRice = (totalRice * 2) / 3;

	const stages: BrewStage[] = [
		{
			name: '밑술',
			rice: milsulRice,
			water: waterForRice(milsulRice, riceForm),
			nuruk: nurukForRice(milsulRice)
		},
		{
			name: '덧술',
			rice: deotsulRice,
			water: 0,
			nuruk: 0
		}
	];

	return {
		type: 'iyang',
		label: '이양주',
		stages,
		...sumStages(stages)
	};
}

export function calculateSamyang(totalRice: number, riceForm: RiceForm): BrewResult {
	const milsulRice = totalRice / 6;
	const deotsul1Rice = totalRice / 6;
	const deotsul2Rice = (totalRice * 4) / 6;

	const stages: BrewStage[] = [
		{
			name: '밑술',
			rice: milsulRice,
			water: waterForRice(milsulRice, riceForm),
			nuruk: nurukForRice(milsulRice)
		},
		{
			name: '덧술',
			rice: deotsul1Rice,
			water: waterForRice(deotsul1Rice, riceForm),
			nuruk: 0
		},
		{
			name: '덧술2',
			rice: deotsul2Rice,
			water: 0,
			nuruk: 0
		}
	];

	return {
		type: 'samyang',
		label: '삼양주',
		stages,
		...sumStages(stages)
	};
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run:
```bash
cd ~/projects/alcolmeter
npx vitest run
```

Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
cd ~/projects/alcolmeter
git add src/lib/calculator/makgeolli.ts tests/calculator/makgeolli.test.ts
git commit -m "feat: add makgeolli calculator logic with tests"
```

---

### Task 4: IngredientInput Component

**Files:**
- Create: `src/lib/components/IngredientInput.svelte`

- [ ] **Step 1: Create IngredientInput component**

Create `src/lib/components/IngredientInput.svelte`:

```svelte
<script lang="ts">
	import { RICE_FORM_LABELS, type RiceForm } from '$lib/types';

	let {
		totalRice = $bindable(6),
		riceForm = $bindable('tteok' as RiceForm)
	}: {
		totalRice: number;
		riceForm: RiceForm;
	} = $props();

	const riceFormOptions: { value: RiceForm; label: string }[] = Object.entries(RICE_FORM_LABELS).map(
		([value, label]) => ({ value: value as RiceForm, label })
	);
</script>

<section class="input-section">
	<div class="field">
		<label for="total-rice">쌀 총량 (ℓ)</label>
		<input
			id="total-rice"
			type="number"
			min="0.1"
			step="0.1"
			bind:value={totalRice}
		/>
	</div>

	<div class="field">
		<label for="rice-form">밑술 쌀 형태</label>
		<select id="rice-form" bind:value={riceForm}>
			{#each riceFormOptions as option}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>
	</div>
</section>

<style>
	.input-section {
		display: flex;
		gap: 1.5rem;
		flex-wrap: wrap;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		flex: 1;
		min-width: 180px;
	}

	label {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-muted);
	}

	input, select {
		padding: 0.75rem;
		border: 1px solid var(--color-border);
		border-radius: 8px;
		font-size: 1rem;
		background: var(--color-card);
		color: var(--color-text);
	}

	input:focus, select:focus {
		outline: 2px solid var(--color-primary);
		outline-offset: -1px;
	}
</style>
```

- [ ] **Step 2: Commit**

```bash
cd ~/projects/alcolmeter
git add src/lib/components/IngredientInput.svelte
git commit -m "feat: add IngredientInput component"
```

---

### Task 5: ResultTable Component

**Files:**
- Create: `src/lib/components/ResultTable.svelte`

- [ ] **Step 1: Create ResultTable component**

Create `src/lib/components/ResultTable.svelte`:

```svelte
<script lang="ts">
	import type { BrewResult } from '$lib/types';

	let { result }: { result: BrewResult } = $props();

	function fmt(value: number): string {
		if (value === 0) return '-';
		return Number.isInteger(value) ? value.toString() : value.toFixed(2);
	}
</script>

<div class="result-table">
	<table>
		<thead>
			<tr>
				<th>단계</th>
				<th>쌀 (ℓ)</th>
				<th>물 (ℓ)</th>
				<th>누룩 (ℓ)</th>
			</tr>
		</thead>
		<tbody>
			{#each result.stages as stage}
				<tr>
					<td class="stage-name">{stage.name}</td>
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

	th:first-child, td.stage-name {
		text-align: left;
	}

	td.stage-name {
		font-weight: 600;
	}

	tfoot td {
		font-weight: 700;
		border-top: 2px solid var(--color-primary);
		background: rgba(74, 103, 65, 0.05);
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
```

- [ ] **Step 2: Commit**

```bash
cd ~/projects/alcolmeter
git add src/lib/components/ResultTable.svelte
git commit -m "feat: add ResultTable component"
```

---

### Task 6: Makgeolli Calculator Page

**Files:**
- Create: `src/routes/makgeolli/+page.svelte`

- [ ] **Step 1: Create makgeolli page**

Create `src/routes/makgeolli/+page.svelte`:

```svelte
<script lang="ts">
	import type { RiceForm } from '$lib/types';
	import { calculateDanyang, calculateIyang, calculateSamyang } from '$lib/calculator/makgeolli';
	import IngredientInput from '$lib/components/IngredientInput.svelte';
	import ResultTable from '$lib/components/ResultTable.svelte';

	let totalRice = $state(6);
	let riceForm: RiceForm = $state('tteok');

	type BrewTab = 'danyang' | 'iyang' | 'samyang';
	let activeTab: BrewTab = $state('iyang');

	const tabs: { id: BrewTab; label: string }[] = [
		{ id: 'danyang', label: '단양주' },
		{ id: 'iyang', label: '이양주' },
		{ id: 'samyang', label: '삼양주' }
	];

	let result = $derived.by(() => {
		const rice = Math.max(0, totalRice || 0);
		switch (activeTab) {
			case 'danyang':
				return calculateDanyang(rice, riceForm);
			case 'iyang':
				return calculateIyang(rice, riceForm);
			case 'samyang':
				return calculateSamyang(rice, riceForm);
		}
	});
</script>

<svelte:head>
	<title>막걸리 계산기 - 알콜미터</title>
</svelte:head>

<div class="calculator">
	<h1>막걸리 계산기</h1>
	<p class="subtitle">쌀의 양과 형태를 입력하면 이상적인 배합 비율을 계산합니다</p>

	<div class="card">
		<IngredientInput bind:totalRice bind:riceForm />
	</div>

	<div class="card result-card">
		<nav class="tabs">
			{#each tabs as tab}
				<button
					class="tab"
					class:active={activeTab === tab.id}
					onclick={() => activeTab = tab.id}
				>
					{tab.label}
				</button>
			{/each}
		</nav>

		{#if totalRice > 0}
			<ResultTable {result} />
		{:else}
			<p class="empty">쌀 총량을 입력해주세요.</p>
		{/if}
	</div>
</div>

<style>
	.calculator {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	h1 {
		font-size: 1.5rem;
		color: var(--color-primary);
	}

	.subtitle {
		font-size: 0.9rem;
		color: var(--color-muted);
		margin-top: -1rem;
	}

	.card {
		background: var(--color-card);
		border-radius: 12px;
		padding: 1.5rem;
		border: 1px solid var(--color-border);
	}

	.tabs {
		display: flex;
		gap: 0;
		margin-bottom: 1.5rem;
		border-bottom: 2px solid var(--color-border);
	}

	.tab {
		flex: 1;
		padding: 0.75rem 1rem;
		background: none;
		border: none;
		font-size: 0.95rem;
		font-weight: 500;
		color: var(--color-muted);
		cursor: pointer;
		border-bottom: 2px solid transparent;
		margin-bottom: -2px;
		transition: all 0.2s;
	}

	.tab.active {
		color: var(--color-primary);
		border-bottom-color: var(--color-primary);
		font-weight: 700;
	}

	.tab:hover:not(.active) {
		color: var(--color-text);
	}

	.empty {
		text-align: center;
		color: var(--color-muted);
		padding: 2rem;
	}
</style>
```

- [ ] **Step 2: Commit**

```bash
cd ~/projects/alcolmeter
git add src/routes/makgeolli/+page.svelte
git commit -m "feat: add makgeolli calculator page"
```

---

### Task 7: Main Landing Page

**Files:**
- Modify: `src/routes/+page.svelte`

- [ ] **Step 1: Create landing page**

Replace `src/routes/+page.svelte`:

```svelte
<svelte:head>
	<title>알콜미터 - 양조 계산기</title>
</svelte:head>

<div class="landing">
	<h1>어떤 술을 빚으시나요?</h1>

	<div class="drink-grid">
		<a href="/makgeolli" class="drink-card active">
			<span class="emoji">🍶</span>
			<span class="name">막걸리</span>
		</a>

		<div class="drink-card disabled">
			<span class="emoji">🍺</span>
			<span class="name">사이다</span>
			<span class="badge">준비 중</span>
		</div>

		<div class="drink-card disabled">
			<span class="emoji">🍷</span>
			<span class="name">와인</span>
			<span class="badge">준비 중</span>
		</div>
	</div>
</div>

<style>
	.landing {
		text-align: center;
		padding: 2rem 0;
	}

	h1 {
		font-size: 1.75rem;
		margin-bottom: 2rem;
		color: var(--color-text);
	}

	.drink-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
		gap: 1rem;
		max-width: 600px;
		margin: 0 auto;
	}

	.drink-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 2rem 1rem;
		border-radius: 12px;
		border: 2px solid var(--color-border);
		background: var(--color-card);
		text-decoration: none;
		color: var(--color-text);
		transition: all 0.2s;
		position: relative;
	}

	.drink-card.active:hover {
		border-color: var(--color-primary);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.drink-card.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.emoji {
		font-size: 2.5rem;
	}

	.name {
		font-size: 1.1rem;
		font-weight: 600;
	}

	.badge {
		font-size: 0.7rem;
		background: var(--color-muted);
		color: white;
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
	}
</style>
```

- [ ] **Step 2: Commit**

```bash
cd ~/projects/alcolmeter
git add src/routes/+page.svelte
git commit -m "feat: add landing page with drink type selection"
```

---

### Task 8: Local Server Verification

- [ ] **Step 1: Run dev server**

Run:
```bash
cd ~/projects/alcolmeter
npm run dev -- --port 5173
```

- [ ] **Step 2: Verify in browser**

Open `http://localhost:5173` and check:
1. Landing page shows 3 drink cards (막걸리 active, 사이다/와인 disabled)
2. Click 막걸리 → navigates to `/makgeolli`
3. Input 쌀 총량 6, 떡 선택 → 이양주 탭 shows 밑술 2/2/0.2, 덧술 4/-/-
4. Switch tabs (단양주, 삼양주) → results update
5. Change 쌀 형태 to 죽 → water values update reactively
6. Mobile responsive: narrow window stacks vertically

- [ ] **Step 3: Get user approval before proceeding to deployment**

Show the running app to the user for review.

---

### Task 9: GitHub Repository & Push

- [ ] **Step 1: Create GitHub private repo**

Run:
```bash
cd ~/projects/alcolmeter
gh repo create TransparentDeveloper/alcolmeter --private --source=. --remote=origin
```

- [ ] **Step 2: Rename branch to main and push**

Run:
```bash
cd ~/projects/alcolmeter
git branch -M main
git push -u origin main
```

---

### Task 10: Vercel Deployment

- [ ] **Step 1: Install Vercel CLI if not present**

Run:
```bash
npm install -g vercel
```

- [ ] **Step 2: Link project to Vercel**

Run:
```bash
cd ~/projects/alcolmeter
vercel link
```

When prompted:
- Set up: Yes
- Scope: select your account
- Link to existing project: No
- Project name: alcolmeter
- Directory: `./`

- [ ] **Step 3: Deploy to production**

Run:
```bash
cd ~/projects/alcolmeter
vercel --prod
```

Expected: Deployment succeeds, outputs a production URL.

- [ ] **Step 4: Verify production deployment**

Open the production URL in browser and repeat the checks from Task 8 Step 2.

- [ ] **Step 5: Commit any Vercel config files**

```bash
cd ~/projects/alcolmeter
git add -A
git commit -m "chore: add vercel config" || echo "Nothing to commit"
git push
```
