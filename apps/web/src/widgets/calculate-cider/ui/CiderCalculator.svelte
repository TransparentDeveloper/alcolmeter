<script lang="ts">
	import { CiderCalculatorState, INPUT_MAX } from './CiderCalculatorState.svelte';
	import VarietySelect from './VarietySelect.svelte';
	import ResultPanel from './ResultPanel.svelte';
	import type { AppleVarietyType } from '$entities/cider/model';

	// 표시 텍스트(라벨)는 그리는 뷰에서 관리한다. 상태 class에는 두지 않는다.
	const VARIETY_OPTIONS: { value: AppleVarietyType; label: string; hint: string }[] = [
		{ value: 'FUJI', label: '후지 (부사)', hint: '달고 진함' },
		{ value: 'HONGOK', label: '홍옥', hint: '새콤·향 좋음' },
		{ value: 'HONGRO', label: '홍로', hint: '균형' },
		{ value: 'AORI', label: '아오리 (쓰가루)', hint: '산뜻·덜 단' }
	];

	const calc = new CiderCalculatorState();
</script>

<div class="calculator">
	<div class="col">
		<section class="card">
			<h2 class="section-label">재료 입력</h2>

			<div class="field">
				<label for="apple-kg">사과 (kg)</label>
				<div class="input-with-hint">
					<input
						id="apple-kg"
						type="number"
						min="0.1"
						max={INPUT_MAX.apple}
						step="0.1"
						placeholder="10"
						bind:value={calc.appleKg}
					/>
					<span class="ratio-hint">최대 {INPUT_MAX.apple}kg</span>
				</div>
			</div>

			<div class="field">
				<span class="field-label">품종</span>
				<VarietySelect bind:value={calc.variety} options={VARIETY_OPTIONS} />
			</div>

			<div class="field">
				<label class="toggle">
					<input type="checkbox" bind:checked={calc.sugarEnabled} />
					<span>설탕 가당 (선택)</span>
				</label>
				{#if calc.sugarEnabled}
					<div class="input-with-hint">
						<input
							id="sugar-grams"
							type="number"
							min="0"
							max={INPUT_MAX.sugar}
							step="100"
							placeholder="0"
							aria-label="설탕 (g)"
							bind:value={calc.sugarGrams}
						/>
						<span class="ratio-hint">설탕 g · 최대 {INPUT_MAX.sugar}g</span>
					</div>
				{/if}
			</div>
		</section>

		<p class="guide">
			사이다는 기본적으로 끝까지 발효돼 <strong>드라이</strong>합니다. 달게 만들려면 발효를 마친 뒤 가당(백스위트닝)하거나 저온으로 발효를 멈추세요. 사과만으로는 보통 <strong>5~8%</strong>가 나옵니다.
		</p>
	</div>

	<div class="col">
		<section class="card">
			<h2 class="section-label">예상 결과</h2>
			{#if calc.appleKg > 0}
				<ResultPanel brew={calc.brew} />
			{:else}
				<p class="empty">사과 양을 입력해주세요.</p>
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

	.field {
		display: flex;
		flex-direction: column;
		gap: var(--ds-space-sm);
		width: 100%;
	}

	.field + .field {
		margin-top: var(--ds-space-lg);
	}

	label,
	.field-label {
		font-size: var(--ds-text-sm);
		font-weight: var(--ds-weight-medium);
		color: var(--ds-color-ink-1);
	}

	input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	input[type='number'] {
		-moz-appearance: textfield;
		padding: var(--ds-space-sm) var(--ds-space-md);
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		border-radius: var(--ds-radius-md);
		font-size: var(--ds-text-base);
		font-family: var(--ds-font-sans);
		background: var(--ds-color-surface);
		color: var(--ds-color-ink-1);
		transition: border-color var(--ds-duration-short) var(--ds-ease-out),
			box-shadow var(--ds-duration-short) var(--ds-ease-out);
	}

	input[type='number']:hover {
		border-color: var(--ds-color-border-3);
	}

	input[type='number']:focus {
		outline: none;
		border-color: var(--ds-color-focus);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--ds-color-focus) 22%, transparent);
	}

	.input-with-hint {
		position: relative;
	}

	.input-with-hint input {
		width: 100%;
		padding-right: 9.5rem;
	}

	.ratio-hint {
		position: absolute;
		right: var(--ds-space-md);
		top: 50%;
		transform: translateY(-50%);
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-3);
		pointer-events: none;
	}

	.toggle {
		display: flex;
		align-items: center;
		gap: var(--ds-space-sm);
		cursor: pointer;
	}

	.toggle input {
		width: 1rem;
		height: 1rem;
		accent-color: var(--ds-color-action);
	}

	.guide {
		margin-top: var(--ds-space-lg);
		padding: var(--ds-space-md);
		background: var(--ds-color-surface);
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		border-left: 3px solid var(--ds-color-info);
		border-radius: var(--ds-radius-sm);
		font-size: var(--ds-text-sm);
		color: var(--ds-color-ink-2);
		line-height: 1.55;
	}

	.guide strong {
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
