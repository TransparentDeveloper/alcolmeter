<script lang="ts">
	import { authStore } from '$features/auth/store/index.svelte';
	import { AccountDeletionState } from './AccountDeletionState.svelte';

	const deletion = new AccountDeletionState();
</script>

{#if authStore.value.status === 'signedIn' && authStore.value.user}
	<section>
		<h2>계정</h2>
		<p class="desc">
			<span class="who">{authStore.value.user.displayName}</span> 계정으로 로그인되어 있어요.
		</p>

		<div class="danger">
			<div class="danger-text">
				<span class="danger-title">회원 탈퇴</span>
				<span class="danger-hint">계정과 로그인 정보가 삭제되며 되돌릴 수 없어요.</span>
			</div>
			<button type="button" class="danger-btn outline" onclick={() => deletion.open(confirmContent)}>
				회원 탈퇴
			</button>
		</div>
	</section>
{/if}

{#snippet confirmContent()}
	<div class="confirm">
		<h3>정말 탈퇴하시겠어요?</h3>
		<p>
			탈퇴하면 계정과 로그인 정보가 삭제되고 다시 되돌릴 수 없어요. 알콜위키·커뮤니티에 남긴 글은
			작성자가 익명으로 바뀐 채로 남습니다.
		</p>
		{#if deletion.error}
			<p class="error" role="alert">{deletion.error}</p>
		{/if}
		<div class="confirm-actions">
			<button type="button" class="cancel" onclick={() => deletion.onClose()} disabled={deletion.isDeleting}>
				취소
			</button>
			<button
				type="button"
				class="danger-btn solid"
				onclick={() => deletion.onConfirm()}
				disabled={deletion.isDeleting}
			>
				{deletion.isDeleting ? '처리 중…' : '탈퇴하기'}
			</button>
		</div>
	</div>
{/snippet}

<style>
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

	.desc {
		font-size: var(--ds-text-sm);
		line-height: var(--ds-leading-normal);
		color: var(--ds-color-ink-3);
		margin-bottom: var(--ds-space-md);
	}

	.desc .who {
		font-weight: var(--ds-weight-semibold);
		color: var(--ds-color-ink-1);
	}

	/* 위험 구역 — 괘선 프레임 안에 설명 + 행동 */
	.danger {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--ds-space-md);
		padding: var(--ds-space-md);
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		border-radius: var(--ds-radius-md);
	}

	.danger-text {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.danger-title {
		font-size: var(--ds-text-base);
		font-weight: var(--ds-weight-semibold);
		color: var(--ds-color-ink-1);
	}

	.danger-hint {
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-4);
	}

	.danger-btn {
		font: inherit;
		font-size: var(--ds-text-sm);
		font-weight: var(--ds-weight-medium);
		border-radius: var(--ds-radius-md);
		padding: var(--ds-space-sm) var(--ds-space-lg);
		cursor: pointer;
		white-space: nowrap;
		transition:
			background-color var(--ds-duration-short) var(--ds-ease-out),
			border-color var(--ds-duration-short) var(--ds-ease-out),
			color var(--ds-duration-short) var(--ds-ease-out);
	}

	/* 아웃라인 — 위험구역 진입 버튼 (절제된 표현) */
	.danger-btn.outline {
		color: var(--ds-color-error);
		background: transparent;
		border: var(--ds-border-width) solid var(--ds-color-error);
	}
	.danger-btn.outline:hover {
		background: var(--ds-color-spark-tint);
	}

	/* 솔리드 — 다이얼로그의 최종 확정 버튼 (on-danger 색은 토큰이 없어 흰색 고정) */
	.danger-btn.solid {
		color: #fff;
		background: var(--ds-color-error);
		border: var(--ds-border-width) solid transparent;
	}
	.danger-btn.solid:hover:not([disabled]) {
		background: color-mix(in srgb, var(--ds-color-error) 86%, black);
	}

	.danger-btn[disabled] {
		opacity: 0.6;
		cursor: not-allowed;
	}

	/* 확인 다이얼로그 내용 (프레임·백드롭·중앙정렬은 shared/ui/Dialog의 DialogFrame이 담당) */
	.confirm h3 {
		font-family: var(--ds-font-display);
		font-size: var(--ds-text-lg);
		font-weight: var(--ds-weight-bold);
		color: var(--ds-color-ink-1);
		margin-bottom: var(--ds-space-sm);
	}

	.confirm p {
		font-size: var(--ds-text-sm);
		line-height: 1.7;
		margin: 0 0 var(--ds-space-lg);
	}

	.confirm p.error {
		color: var(--ds-color-error);
		margin-bottom: var(--ds-space-md);
	}

	.confirm-actions {
		display: flex;
		justify-content: flex-end;
		gap: var(--ds-space-sm);
	}

	.cancel {
		font: inherit;
		font-size: var(--ds-text-sm);
		color: var(--ds-color-ink-2);
		background: none;
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		border-radius: var(--ds-radius-md);
		padding: var(--ds-space-sm) var(--ds-space-lg);
		cursor: pointer;
		transition: border-color var(--ds-duration-short) var(--ds-ease-out);
	}
	.cancel:hover:not([disabled]) {
		border-color: var(--ds-color-border-3);
		color: var(--ds-color-ink-1);
	}
	.cancel[disabled] {
		opacity: 0.6;
		cursor: not-allowed;
	}
</style>
