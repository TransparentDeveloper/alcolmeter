<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
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
		<svg class="g-icon" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
			<path
				fill="#4285F4"
				d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
			/>
			<path
				fill="#34A853"
				d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
			/>
			<path
				fill="#FBBC05"
				d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
			/>
			<path
				fill="#EA4335"
				d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
			/>
		</svg>
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
	.g-icon {
		flex-shrink: 0;
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
