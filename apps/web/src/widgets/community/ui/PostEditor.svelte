<script lang="ts">
	import { PostEditorState } from './PostEditorState.svelte';

	let {
		editor,
		submitLabel,
		onsubmit
	}: {
		editor: PostEditorState;
		submitLabel: string;
		onsubmit: () => void;
	} = $props();

	// 소문단 높이를 내용에 맞춰 자동 조절한다 (스크롤·수동 리사이즈 없이).
	function autoresize(node: HTMLTextAreaElement) {
		const resize = () => {
			node.style.height = 'auto';
			node.style.height = `${node.scrollHeight}px`;
		};
		resize();
		node.addEventListener('input', resize);
		return { destroy: () => node.removeEventListener('input', resize) };
	}
</script>

<form onsubmit={(e) => e.preventDefault()}>
	<input class="title" bind:value={editor.title} placeholder="제목" />

	<div class="blocks">
		{#each editor.blocks as block (block.id)}
			<fieldset class="block">
				{#if block.elements.length > 0}
					<div class="elements">
						{#each block.elements as element (element.id)}
							<div class="element">
								{#if element.type === 'heading'}
									<input class="heading" bind:value={element.value} placeholder="소제목" />
								{:else if element.type === 'body'}
									<textarea
										class="body"
										bind:value={element.value}
										placeholder="소문단을 입력하세요"
										rows="2"
										use:autoresize
									></textarea>
								{:else if element.type === 'image'}
									<span class="image-placeholder">이미지 (준비 중)</span>
								{/if}
								<button
									type="button"
									class="el-remove"
									onclick={() => editor.removeElement(block.id, element.id)}
									aria-label="요소 삭제"
								>
									×
								</button>
							</div>
						{/each}
					</div>
				{/if}

				<div class="toolbar">
					<div class="add">
						<button
							type="button"
							onclick={() => editor.addHeading(block.id)}
							disabled={editor.hasHeading(block.id)}
						>
							+ 소제목
						</button>
						<button type="button" onclick={() => editor.addBody(block.id)}>+ 소문단</button>
						<button type="button" class="soon" disabled title="준비 중">+ 이미지</button>
					</div>
					{#if editor.blocks.length > 1}
						<button
							type="button"
							class="block-remove"
							onclick={() => editor.removeBlock(block.id)}
						>
							문단 삭제
						</button>
					{/if}
				</div>
			</fieldset>
		{/each}
	</div>

	<button type="button" class="add-block" onclick={() => editor.addBlock()}>+ 문단 추가</button>

	<div class="actions">
		<button type="submit" class="submit" disabled={!editor.isValid} onclick={onsubmit}>
			{submitLabel}
		</button>
	</div>
</form>

<style>
	form {
		display: grid;
		gap: var(--ds-space-xl);
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

	.blocks {
		display: grid;
		gap: var(--ds-space-md);
	}

	.block {
		min-inline-size: 0;
		display: grid;
		gap: var(--ds-space-md);
		margin: 0;
		padding: var(--ds-space-lg);
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		border-radius: var(--ds-radius-lg);
		background: var(--ds-color-surface);
		transition:
			border-color var(--ds-duration-short) var(--ds-ease-out),
			box-shadow var(--ds-duration-short) var(--ds-ease-out);
	}
	.block:focus-within {
		border-color: var(--ds-color-focus);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--ds-color-focus) 18%, transparent);
	}

	.elements {
		display: grid;
		gap: var(--ds-space-sm);
	}
	.element {
		display: flex;
		align-items: flex-start;
		gap: var(--ds-space-sm);
	}
	.element > .heading,
	.element > .body,
	.element > .image-placeholder {
		flex: 1;
		min-width: 0;
	}

	.heading {
		font: inherit;
		font-size: var(--ds-text-lg);
		font-weight: var(--ds-weight-semibold);
		color: var(--ds-color-ink-1);
		background: transparent;
		border: none;
		padding: 0;
	}
	.heading::placeholder {
		color: var(--ds-color-ink-4);
	}
	.heading:focus {
		outline: none;
	}

	.body {
		font: inherit;
		font-size: var(--ds-text-base);
		line-height: var(--ds-leading-normal);
		color: var(--ds-color-ink-1);
		background: transparent;
		border: none;
		padding: 0;
		resize: none;
		overflow: hidden;
		min-height: 2.5rem;
	}
	.body::placeholder {
		color: var(--ds-color-ink-4);
	}
	.body:focus {
		outline: none;
	}

	.image-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--ds-space-xl);
		font-size: var(--ds-text-sm);
		color: var(--ds-color-ink-4);
		border: var(--ds-border-width) dashed var(--ds-color-border-2);
		border-radius: var(--ds-radius-md);
	}

	.el-remove {
		flex: none;
		font: inherit;
		font-size: var(--ds-text-lg);
		line-height: 1;
		color: var(--ds-color-ink-4);
		background: none;
		border: none;
		padding: 0 var(--ds-space-2xs);
		cursor: pointer;
		transition: color var(--ds-duration-short) var(--ds-ease-out);
	}
	.el-remove:hover {
		color: var(--ds-color-error);
	}

	.toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--ds-space-md);
		border-top: var(--ds-border-width) solid var(--ds-color-border-1);
		padding-top: var(--ds-space-md);
	}
	.add {
		display: flex;
		gap: var(--ds-space-sm);
		flex-wrap: wrap;
	}
	.add button {
		font: inherit;
		font-size: var(--ds-text-xs);
		font-weight: var(--ds-weight-medium);
		color: var(--ds-color-ink-2);
		background: transparent;
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		border-radius: var(--ds-radius-full);
		padding: var(--ds-space-2xs) var(--ds-space-md);
		cursor: pointer;
		transition:
			border-color var(--ds-duration-short) var(--ds-ease-out),
			color var(--ds-duration-short) var(--ds-ease-out);
	}
	.add button:hover:not([disabled]) {
		border-color: var(--ds-color-border-3);
		color: var(--ds-color-ink-1);
	}
	.add button[disabled] {
		color: var(--ds-color-ink-4);
		cursor: not-allowed;
	}

	.block-remove {
		flex: none;
		font: inherit;
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-3);
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		transition: color var(--ds-duration-short) var(--ds-ease-out);
	}
	.block-remove:hover {
		color: var(--ds-color-error);
	}

	.add-block {
		font: inherit;
		font-size: var(--ds-text-sm);
		font-weight: var(--ds-weight-medium);
		color: var(--ds-color-ink-2);
		background: transparent;
		border: var(--ds-border-width) dashed var(--ds-color-border-2);
		border-radius: var(--ds-radius-md);
		padding: var(--ds-space-md);
		cursor: pointer;
		transition:
			border-color var(--ds-duration-short) var(--ds-ease-out),
			color var(--ds-duration-short) var(--ds-ease-out);
	}
	.add-block:hover {
		border-color: var(--ds-color-border-3);
		color: var(--ds-color-ink-1);
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
