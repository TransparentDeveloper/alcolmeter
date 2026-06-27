<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
</script>

<Seo
	title="개인정보처리방침 - 알콜미터"
	description="알콜미터 개인정보처리방침. 사용자 데이터를 수집하지 않습니다."
	path="/privacy"
	image="/og/privacy.png"
/>

<article>
	<h1>개인정보처리방침</h1>
	<p class="updated">최종 수정일: 2026년 5월 9일</p>

	<section>
		<h2>수집하는 데이터</h2>
		<p>알콜미터(웹 및 Chrome 확장 프로그램)는 사용자 데이터를 수집, 저장, 전송하지 않습니다. 모든 계산은 사용자의 브라우저 내에서만 처리됩니다.</p>
	</section>

	<section>
		<h2>외부 서비스</h2>
		<p>이 서비스는 별도의 분석 도구, 광고, 또는 제3자 데이터 수집 스크립트를 사용하지 않습니다.</p>
	</section>

	<section>
		<h2>문의</h2>
		<p>개인정보 관련 문의는 아래 이메일로 연락해 주세요.</p>
		<img src="/email-contact.png" alt="문의 이메일 주소" class="email-img" />
	</section>
</article>

<style>
	article {
		max-width: var(--ds-container);
	}

	h1 {
		font-family: var(--ds-font-display);
		font-size: var(--ds-text-2xl);
		font-weight: var(--ds-weight-bold);
		letter-spacing: var(--ds-tracking-tight);
		color: var(--ds-color-ink-1);
		margin-bottom: var(--ds-space-xs);
	}

	.updated {
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-3);
		margin-bottom: var(--ds-space-3xl);
	}

	section {
		padding-top: var(--ds-space-lg);
		margin-bottom: var(--ds-space-xl);
		border-top: var(--ds-border-width) solid var(--ds-color-border-1);
	}

	h2 {
		font-family: var(--ds-font-display);
		font-size: var(--ds-text-lg);
		font-weight: var(--ds-weight-semibold);
		color: var(--ds-color-ink-1);
		margin-bottom: var(--ds-space-sm);
	}

	p {
		font-size: var(--ds-text-base);
		line-height: var(--ds-leading-normal);
		color: var(--ds-color-ink-2);
	}

	.email-img {
		display: block;
		margin-top: var(--ds-space-sm);
		height: 1.25rem;
	}
</style>
