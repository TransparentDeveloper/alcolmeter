<script lang="ts">
	import { LoginForm } from '$widgets/auth/ui';
</script>

<main>
	<h1>로그인</h1>
	<p>글을 쓰려면 로그인이 필요해요. 읽기는 로그인 없이도 가능합니다.</p>
	<LoginForm />
</main>

<style>
	main {
		max-width: 32rem;
		margin: 0 auto;
		display: grid;
		gap: var(--ds-space-lg);
	}
	h1 {
		font-family: var(--ds-font-display);
	}
	p {
		color: var(--ds-color-ink-3);
	}
</style>
