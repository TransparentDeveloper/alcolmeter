<script lang="ts">
	import type { Component } from 'svelte';
	import type { Provider } from '@supabase/supabase-js';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { GoogleIcon } from '$shared/icon/ui';
	import { LoginFormView } from './LoginFormView.svelte';

	const form = new LoginFormView();

	// 소셜 로그인 목록. 카카오·네이버는 여기 항목(+아이콘·CSS)만 추가한다.
	const providers: { id: Provider; label: string; Icon: Component }[] = [
		{ id: 'google', label: 'Google로 계속', Icon: GoogleIcon }
	];

	// 이미 로그인 상태로 로그인 페이지에 오면 목적지로 보낸다.
	// replace: 히스토리에서 로그인 페이지를 지워 뒤로 가기가 걸리지 않게 한다.
	$effect(() => {
		if (form.isSignedIn) goto(form.redirectTo, { replaceState: true });
	});

	onMount(() => form.readOAuthError());
</script>

<div class="auth">
	<div class="providers">
		{#each providers as p (p.id)}
			{@const Icon = p.Icon}
			<button type="button" class={`btn btn-${p.id}`} onclick={() => form.signInWithOAuth(p.id)}>
				<Icon />
				{p.label}
			</button>
		{/each}
	</div>

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
	.providers {
		display: grid;
		gap: var(--ds-space-md);
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
	.btn-google {
		color: var(--ds-color-ink-1);
		background: var(--ds-color-surface);
		border-color: var(--ds-color-border-2);
	}
	.btn-google:hover {
		background: var(--ds-color-hover);
	}
	.alert {
		margin: 0;
		font-size: var(--ds-text-sm);
		color: var(--ds-color-error);
	}
</style>
