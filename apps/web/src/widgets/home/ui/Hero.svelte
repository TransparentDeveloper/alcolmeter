<section class="hero ds-paper-grid">
	<div class="ds-fizz" aria-hidden="true">
		<span class="ds-fizz__bubble" style="left:9%;width:6px;height:6px;animation-delay:0s;animation-duration:4.4s"></span>
		<span class="ds-fizz__bubble" style="left:21%;width:9px;height:9px;animation-delay:1.6s;animation-duration:5.2s"></span>
		<span class="ds-fizz__bubble" style="left:34%;width:5px;height:5px;animation-delay:0.8s;animation-duration:3.8s"></span>
		<span class="ds-fizz__bubble" style="left:47%;width:8px;height:8px;animation-delay:2.4s;animation-duration:4.9s"></span>
		<span class="ds-fizz__bubble" style="left:58%;width:6px;height:6px;animation-delay:0.4s;animation-duration:4.2s"></span>
		<span class="ds-fizz__bubble" style="left:69%;width:10px;height:10px;animation-delay:3.1s;animation-duration:5.6s"></span>
		<span class="ds-fizz__bubble" style="left:80%;width:5px;height:5px;animation-delay:1.2s;animation-duration:3.6s"></span>
		<span class="ds-fizz__bubble" style="left:90%;width:7px;height:7px;animation-delay:2.0s;animation-duration:4.7s"></span>
	</div>
	<div class="hero-content">
		<p class="eyebrow">정밀 배합 · 양조 노트</p>
		<h1 class="hero-title">
			알콜미터
			<svg class="hero-underline" viewBox="0 0 220 12" preserveAspectRatio="none" aria-hidden="true">
				<path
					class="ds-underline-draw"
					pathLength="1"
					d="M3,8 C42,2 84,11 124,6 C156,2 192,10 217,5"
					fill="none"
					stroke="currentColor"
					stroke-width="3"
					stroke-linecap="round"
				/>
			</svg>
		</h1>
		<p class="hero-desc">
			전통주 양조를 위한 정밀 배합 계산기.<br />쌀의 양만 입력하면 최적의 비율을 알려드립니다.
		</p>
	</div>
</section>

<style>
	/* Hero — measurement-notebook paper */
	.hero {
		position: relative;
		overflow: hidden;
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		border-radius: var(--ds-radius-lg);
		box-shadow: var(--ds-shadow-paper);
		padding: var(--ds-space-2xl) var(--ds-space-xl);
	}

	.hero-content {
		position: relative;
		z-index: 1;
	}

	.eyebrow {
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-xs);
		font-weight: var(--ds-weight-medium);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ds-color-ink-3);
		margin-bottom: var(--ds-space-md);
	}

	.hero-title {
		position: relative;
		display: inline-block;
		font-family: var(--ds-font-display);
		font-size: var(--ds-text-3xl);
		font-weight: var(--ds-weight-bold);
		line-height: var(--ds-leading-tight);
		letter-spacing: var(--ds-tracking-tight);
		color: var(--ds-color-ink-1);
	}

	.hero-underline {
		position: absolute;
		left: 0;
		right: 0;
		bottom: -0.35em;
		width: 100%;
		height: 0.4em;
		color: var(--ds-color-spark);
		overflow: visible;
	}

	.hero-desc {
		margin-top: var(--ds-space-md);
		font-size: var(--ds-text-base);
		color: var(--ds-color-ink-2);
		max-width: 42ch;
	}
</style>
