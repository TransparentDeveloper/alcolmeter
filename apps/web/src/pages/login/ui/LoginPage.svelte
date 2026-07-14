<script lang="ts">
	import { LoginForm } from '$widgets/auth/ui';
</script>

<div class="login">
	<section class="card">
		<h1>로그인</h1>
		<LoginForm />
	</section>
</div>

<style>
	.login {
		min-height: calc(100dvh - 16rem);
		display: grid;
		place-items: center;
		padding: var(--ds-space-xl) 0;
	}
	.card {
		width: 100%;
		max-width: 24rem;
		display: grid;
		gap: var(--ds-space-xl);
		padding: var(--ds-space-2xl);
		background: var(--ds-color-surface);
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		border-radius: var(--ds-radius-lg);
		box-shadow: var(--ds-shadow-paper);
	}
	h1 {
		margin: 0;
		font-family: var(--ds-font-display);
		font-size: var(--ds-text-xl);
		font-weight: var(--ds-weight-bold);
		letter-spacing: var(--ds-tracking-tight);
		color: var(--ds-color-ink-1);
	}
</style>
