<script lang="ts">
	import { onMount } from 'svelte';
	import { getStoredTheme, setTheme } from '$entities/theme/lib';
	import type { ThemeMode } from '$entities/theme/model';

	// 헤더 토글은 라이트↔다크 2-state. 세밀한 system 모드는 설정 페이지에서 고른다.
	let isDark = $state(false);

	onMount(() => {
		const stored = getStoredTheme();
		isDark =
			stored === 'dark' ||
			(stored === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
	});

	function toggle() {
		const next: ThemeMode = isDark ? 'light' : 'dark';
		setTheme(next);
		isDark = !isDark;
	}
</script>

<button
	class="theme-toggle"
	type="button"
	onclick={toggle}
	aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
>
	{#if isDark}
		<!-- 해: 다크 상태에서 '라이트로 전환'을 나타낸다 -->
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="4.2" />
			<path
				d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
			/>
		</svg>
	{:else}
		<!-- 달: 라이트 상태에서 '다크로 전환'을 나타낸다 -->
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />
		</svg>
	{/if}
</button>

<style>
	.theme-toggle {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: var(--ds-space-2xs);
		color: var(--ds-color-ink-3);
		background: none;
		border: none;
		cursor: pointer;
		border-radius: var(--ds-radius-sm);
		transition:
			color var(--ds-duration-short) var(--ds-ease-out),
			background-color var(--ds-duration-short) var(--ds-ease-out);
	}
	.theme-toggle:hover {
		color: var(--ds-color-ink-1);
		background: var(--ds-color-hover);
	}
	.theme-toggle svg {
		width: 18px;
		height: 18px;
	}
</style>
