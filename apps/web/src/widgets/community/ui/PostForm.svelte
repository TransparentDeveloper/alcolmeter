<script lang="ts">
	import {
		Editor,
		EditorToolbar,
		EditorToolbarSeparator,
		EditorHeading,
		EditorBold,
		EditorItalic,
		EditorStrikethrough,
		EditorBulletList,
		EditorOrderedList,
		EditorIndent,
		EditorOutdent,
		EditorQuote,
		EditorLink,
		EditorDivider
	} from '$shared/ui';
	import type { PostFormState } from './PostFormState.svelte';

	let {
		form,
		submitLabel,
		onsubmit
	}: { form: PostFormState; submitLabel: string; onsubmit: () => void } = $props();

	// 발행 버튼이 비활성인 이유를 알려준다 (라벨은 뷰가 관리)
	const hint = $derived(!form.hasTitle ? '제목을 입력해 주세요.' : '본문을 입력해 주세요.');
</script>

<form
	onsubmit={(e) => {
		e.preventDefault();
		onsubmit();
	}}
>
	<input class="title" bind:value={form.title} placeholder="제목" />

	<Editor bind:value={form.body} placeholder="무엇을 빚었는지, 어땠는지 적어 주세요">
		<EditorToolbar>
			<EditorHeading level={2} label="H2" />
			<EditorHeading level={3} label="H3" />
			<EditorToolbarSeparator />
			<EditorBold />
			<EditorItalic />
			<EditorStrikethrough />
			<EditorToolbarSeparator />
			<EditorBulletList />
			<EditorOrderedList />
			<EditorIndent />
			<EditorOutdent />
			<EditorQuote />
			<EditorToolbarSeparator />
			<EditorLink />
			<EditorDivider />
		</EditorToolbar>
	</Editor>

	<div class="actions">
		{#if !form.isValid}<p class="hint">{hint}</p>{/if}
		<button type="submit" class="submit" disabled={!form.isValid}>{submitLabel}</button>
	</div>
</form>

<style>
	form {
		display: grid;
		gap: var(--ds-space-lg);
	}

	.title {
		font-family: var(--ds-font-display);
		font-size: var(--ds-text-2xl);
		font-weight: var(--ds-weight-bold);
		letter-spacing: var(--ds-tracking-tight);
		color: var(--ds-color-ink-1);
		background: transparent;
		border: none;
		border-bottom: var(--ds-border-width) solid var(--ds-color-border-2);
		padding: var(--ds-space-sm) 0;
		transition: border-color var(--ds-duration-short) var(--ds-ease-out);
	}
	.title::placeholder {
		color: var(--ds-color-ink-4);
	}
	.title:focus {
		outline: none;
		border-bottom-color: var(--ds-color-focus);
	}

	.actions {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: var(--ds-space-md);
	}
	.hint {
		margin: 0;
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-3);
	}
	.submit {
		font: inherit;
		font-weight: var(--ds-weight-medium);
		color: var(--ds-color-on-action);
		background: var(--ds-color-action);
		border: var(--ds-border-width) solid transparent;
		border-radius: var(--ds-radius-md);
		padding: var(--ds-space-sm) var(--ds-space-xl);
		cursor: pointer;
		transition: background-color var(--ds-duration-short) var(--ds-ease-out);
	}
	.submit:hover:not([disabled]) {
		background: var(--ds-color-action-hover);
	}
	.submit:active:not([disabled]) {
		background: var(--ds-color-action-active);
	}
	.submit[disabled] {
		background: var(--ds-color-disabled-border);
		color: var(--ds-color-disabled-fg);
		cursor: not-allowed;
	}
</style>
