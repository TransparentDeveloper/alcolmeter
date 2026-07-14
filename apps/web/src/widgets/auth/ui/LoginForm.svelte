<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { GoogleIcon } from '$shared/icon/ui';
	import { LoginFormView } from './LoginFormView.svelte';

	const form = new LoginFormView();

	// 이미 로그인 상태로 로그인 페이지에 오면 목적지로 보낸다.
	$effect(() => {
		if (form.isSignedIn) goto(form.redirectTo);
	});

	onMount(() => form.readOAuthError());
</script>

<div class="auth">
	<form onsubmit={(e) => e.preventDefault()}>
		<label class="field">
			<span class="label">이메일</span>
			<input
				type="email"
				bind:value={form.email}
				placeholder="you@example.com"
				autocomplete="email"
			/>
		</label>
		<label class="field">
			<span class="label">비밀번호</span>
			<input
				type="password"
				bind:value={form.password}
				placeholder="비밀번호"
				autocomplete="current-password"
			/>
		</label>
		<button type="submit" class="btn btn-primary" onclick={() => form.signIn()}>로그인</button>
	</form>

	<div class="divider">또는</div>

	<button type="button" class="btn btn-google" onclick={() => form.signInWithGoogle()}>
		<GoogleIcon />
		Google로 계속
	</button>

	{#if form.error}
		<p class="alert" role="alert">{form.error}</p>
	{/if}
	{#if form.oauthError}
		<p class="alert" role="alert">{form.oauthError}</p>
	{/if}
</div>

<style>
	.auth {
		display: grid;
		gap: var(--ds-space-lg);
	}
	form {
		display: grid;
		gap: var(--ds-space-md);
	}
	.field {
		display: grid;
		gap: var(--ds-space-2xs);
	}
	.label {
		font-size: var(--ds-text-xs);
		font-weight: var(--ds-weight-medium);
		color: var(--ds-color-ink-2);
	}
	input {
		font: inherit;
		width: 100%;
		padding: var(--ds-space-sm) var(--ds-space-md);
		color: var(--ds-color-ink-1);
		background: var(--ds-color-surface);
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		border-radius: var(--ds-radius-md);
		transition:
			border-color var(--ds-duration-short) var(--ds-ease-out),
			box-shadow var(--ds-duration-short) var(--ds-ease-out);
	}
	input::placeholder {
		color: var(--ds-color-ink-4);
	}
	input:focus {
		outline: none;
		border-color: var(--ds-color-focus);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--ds-color-focus) 20%, transparent);
	}
	.btn {
		font: inherit;
		font-weight: var(--ds-weight-medium);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--ds-space-sm);
		padding: var(--ds-space-sm) var(--ds-space-md);
		border: var(--ds-border-width) solid transparent;
		border-radius: var(--ds-radius-md);
		cursor: pointer;
		transition:
			background-color var(--ds-duration-short) var(--ds-ease-out),
			border-color var(--ds-duration-short) var(--ds-ease-out);
	}
	.btn-primary {
		margin-top: var(--ds-space-sm);
		color: var(--ds-color-on-action);
		background: var(--ds-color-action);
	}
	.btn-primary:hover {
		background: var(--ds-color-action-hover);
	}
	.btn-primary:active {
		background: var(--ds-color-action-active);
	}
	.btn-google {
		color: var(--ds-color-ink-1);
		background: var(--ds-color-surface);
		border-color: var(--ds-color-border-2);
	}
	.btn-google:hover {
		background: var(--ds-color-hover);
	}
	.divider {
		display: flex;
		align-items: center;
		gap: var(--ds-space-md);
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-3);
	}
	.divider::before,
	.divider::after {
		content: '';
		flex: 1;
		height: 1px;
		background: var(--ds-color-border-1);
	}
	.alert {
		margin: 0;
		font-size: var(--ds-text-sm);
		color: var(--ds-color-error);
	}
</style>
