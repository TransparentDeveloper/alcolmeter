<script lang="ts">
	import type { WikiEditorState } from './WikiEditorState.svelte';

	let {
		editor,
		submitLabel,
		onsubmit
	}: { editor: WikiEditorState; submitLabel: string; onsubmit: () => void } = $props();
</script>

<form
	onsubmit={(e) => {
		e.preventDefault();
		onsubmit();
	}}
>
	<label>
		<span>제목</span>
		<input bind:value={editor.title} readonly={!editor.isNew} placeholder="예: 고두밥" />
	</label>
	<p class="hint">게시 후 제목·주소는 수정할 수 없어요. 주소: <code>/wiki/{editor.slug || '…'}</code></p>

	<label>
		<span>요약</span>
		<input bind:value={editor.summary} placeholder="한 줄 요약" />
	</label>
	<label>
		<span>분류</span>
		<input bind:value={editor.category} placeholder="쌀 형태 / 양조 방식 …" />
	</label>
	<label>
		<span>관련용어 slug(콤마)</span>
		<input bind:value={editor.relatedText} placeholder="죽, 범벅" />
	</label>
	<label>
		<span>대표이미지 URL</span>
		<input bind:value={editor.mainImage} placeholder="https://…" />
	</label>
	<label>
		<span>본문(마크다운)</span>
		<textarea bind:value={editor.body} rows="16" placeholder="용어 설명을 마크다운으로 작성하세요"
		></textarea>
	</label>

	<div class="actions">
		<button type="submit" class="submit" disabled={!editor.isValid}>{submitLabel}</button>
	</div>
</form>

<style>
	form {
		display: grid;
		gap: var(--ds-space-lg);
	}

	label {
		display: grid;
		gap: var(--ds-space-xs);
	}

	label > span {
		font-size: var(--ds-text-sm);
		font-weight: var(--ds-weight-medium);
		color: var(--ds-color-ink-2);
	}

	input,
	textarea {
		font: inherit;
		font-size: var(--ds-text-base);
		color: var(--ds-color-ink-1);
		background: var(--ds-color-surface);
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		border-radius: var(--ds-radius-md);
		padding: var(--ds-space-sm) var(--ds-space-md);
		transition: border-color var(--ds-duration-short) var(--ds-ease-out);
	}
	input::placeholder,
	textarea::placeholder {
		color: var(--ds-color-ink-4);
	}
	input:focus,
	textarea:focus {
		outline: none;
		border-color: var(--ds-color-focus);
	}
	input[readonly] {
		color: var(--ds-color-ink-3);
		background: var(--ds-color-hover);
	}

	textarea {
		resize: vertical;
		line-height: var(--ds-leading-normal);
	}

	.hint {
		margin: calc(var(--ds-space-xs) * -1) 0 0;
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-4);
	}
	.hint code {
		color: var(--ds-color-ink-3);
	}

	.actions {
		display: flex;
		justify-content: flex-end;
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
