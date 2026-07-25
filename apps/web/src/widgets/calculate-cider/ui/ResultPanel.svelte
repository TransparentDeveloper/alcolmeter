<script lang="ts">
	import type { CiderBrew } from '$entities/cider/model';

	let { brew }: { brew: CiderBrew } = $props();

	function fmt(value: number): string {
		if (value <= 0) return '-';
		return value.toFixed(2);
	}
</script>

<div class="result">
	<div class="estimates">
		<div class="estimate-item">
			예상 도수 <strong>{brew.alcoholPercent.toFixed(1)} %</strong>
		</div>
		<div class="estimate-item">
			예상 생산량 <strong>{fmt(brew.volumeLiters)} L</strong>
		</div>
	</div>

	{#if !brew.fermentationStopped}
		<p class="dry-note">끝까지 발효돼 <strong>드라이하게</strong> 완성됩니다 (단맛 거의 없음).</p>
	{/if}
</div>

<style>
	.estimates {
		display: flex;
		border-top: var(--ds-border-width) solid var(--ds-color-border-1);
		border-bottom: var(--ds-border-width) solid var(--ds-color-border-1);
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
	}

	.dry-note {
		margin-top: var(--ds-space-lg);
		font-size: var(--ds-text-sm);
		color: var(--ds-color-ink-2);
	}

	.dry-note strong {
		color: var(--ds-color-ink-1);
	}

	@media (max-width: 512px) {
		.estimate-item {
			flex-direction: column;
			align-items: flex-start;
			gap: var(--ds-space-2xs);
		}
	}
</style>
