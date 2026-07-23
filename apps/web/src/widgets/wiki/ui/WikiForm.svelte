<script lang="ts">
	import { slide } from 'svelte/transition';
	import type { WikiFormState } from './WikiFormState.svelte';

	let {
		form,
		submitLabel,
		onsubmit
	}: { form: WikiFormState; submitLabel: string; onsubmit: () => void } = $props();

	function onPickImage(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		form.setImageFile(input.files?.[0] ?? null);
		input.value = ''; // 같은 파일 재선택 허용 (미리보기로 상태를 보여줌)
	}
</script>

<form
	onsubmit={(e) => {
		e.preventDefault();
		onsubmit();
	}}
>
	<div class="field">
		<span class="field-label">제목</span>
		<p class="hint">게시 후 제목·주소는 수정할 수 없어요.</p>
		<input bind:value={form.title} readonly={!form.isNew} placeholder="예) 막걸리" />
	</div>

	<label>
		<span>요약 (선택)</span>
		<input bind:value={form.summary} placeholder="한 줄 요약" />
	</label>

	<!-- 정보 테이블: 대표이미지·대표영상·정보행을 한 표(테두리)로 -->
	<fieldset class="info-table">
		<legend>정보 테이블</legend>

		<div class="te-row">
			<span class="te-label">대표 이미지 (선택)</span>
			<div class="te-control">
				{#if form.imagePreviewSrc}
					<div class="image-preview" transition:slide={{ duration: 150 }}>
						<img src={form.imagePreviewSrc} alt="대표 이미지 미리보기" />
					</div>
				{/if}
				<div class="image-actions">
					<label class="file-btn">
						{form.imagePreviewSrc ? '이미지 변경' : '이미지 선택'}
						<input type="file" accept="image/png,image/jpeg,image/webp" onchange={onPickImage} />
					</label>
					{#if form.imagePreviewSrc}
						<button type="button" class="ghost" onclick={() => form.clearImage()}>이미지 삭제</button>
					{/if}
				</div>
				<input bind:value={form.imageAlt} placeholder="이미지 설명(선택사항)" />
			</div>
		</div>

		<div class="te-row">
			<span class="te-label">대표 영상 (선택)</span>
			<div class="te-control">
				<input bind:value={form.videoUrl} placeholder="예) https://www.youtube.com/..." />
				{#if form.videoUrl && !form.videoId}
					<p class="hint warn">유튜브 링크를 인식하지 못했어요.</p>
				{/if}
				<input bind:value={form.videoTitle} placeholder="영상 제목" />
				<textarea class="desc" bind:value={form.videoDescription} placeholder="영상 설명"></textarea>
				<label class="date-field">
					<span>게시일</span>
					<input
						type="date"
						class:is-empty={!form.videoUploadDate}
						bind:value={form.videoUploadDate}
					/>
				</label>
			</div>
		</div>

		<div class="te-row">
			<span class="te-label">다른 이름 (선택)</span>
			<div class="te-control">
				<input bind:value={form.alternateName} placeholder="별칭·외국어·한자 (콤마로 구분)" />
			</div>
		</div>

		<div class="te-row">
			<span class="te-label">참고 링크 (선택)</span>
			<div class="te-control">
				<textarea class="ref" bind:value={form.sameAs} placeholder="https://… (여러 개는 콤마·줄바꿈으로 구분)"
				></textarea>
			</div>
		</div>

		{#each form.infoRows as row, i (row)}
			<div class="te-row te-row--custom" transition:slide={{ duration: 150 }}>
				<input class="te-label-input" bind:value={row.label} placeholder="항목" />
				<div class="te-control custom">
					<input bind:value={row.value} placeholder="값" />
					<button type="button" class="ghost" onclick={() => form.removeRow(i)} aria-label="행 삭제">×</button>
				</div>
			</div>
		{/each}

		<div class="te-add">
			<button type="button" class="ghost add" onclick={() => form.addRow()}>+ 행 추가</button>
		</div>
	</fieldset>

	<label>
		<span>본문(마크다운)</span>
		<textarea bind:value={form.body} rows="16" placeholder="용어 설명을 마크다운으로 작성하세요"></textarea>
	</label>

	<div class="actions">
		<button type="submit" class="submit" disabled={!form.isValid}>{submitLabel}</button>
	</div>
</form>

<style>
	form {
		display: grid;
		gap: var(--ds-space-lg);
	}

	label,
	.field {
		display: grid;
		gap: var(--ds-space-xs);
	}

	label > span,
	.field-label {
		font-size: var(--ds-text-sm);
		font-weight: var(--ds-weight-medium);
		color: var(--ds-color-ink-2);
	}

	input,
	textarea {
		font: inherit;
		font-size: var(--ds-text-sm);
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

	/* 정보 테이블 — 테두리 있는 괘선 표 */
	.info-table {
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		border-radius: var(--ds-radius-md);
		margin: 0;
		padding: 0;
		min-inline-size: 0;
	}
	.info-table legend {
		margin: 0;
		padding: 0 var(--ds-space-xs) 0 0;
		font-size: var(--ds-text-sm);
		font-weight: var(--ds-weight-medium);
		color: var(--ds-color-ink-2);
	}
	.te-row {
		display: grid;
		grid-template-columns: 9.5rem 1fr;
		border-bottom: var(--ds-border-width) solid var(--ds-color-border-1);
	}
	.te-label {
		padding: var(--ds-space-md);
		background: var(--ds-color-hover);
		border-right: var(--ds-border-width) solid var(--ds-color-border-1);
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-xs);
		font-weight: var(--ds-weight-medium);
		color: var(--ds-color-ink-3);
	}
	/* 커스텀(직접 입력) 행: 라벨 칸에 라벨 입력 */
	.te-label-input {
		margin: var(--ds-space-md);
	}
	.te-control {
		display: grid;
		gap: var(--ds-space-xs);
		padding: var(--ds-space-md);
	}
	.te-control.custom {
		grid-template-columns: 1fr auto;
		align-items: center;
	}
	.te-control.custom input {
		padding: var(--ds-space-xs) var(--ds-space-sm);
	}
	/* 영상 설명·참고 링크: 넉넉한 고정 높이 (리사이즈로 유동 변화 금지) */
	.te-control textarea.desc {
		height: 8rem;
		resize: none;
	}
	.te-control textarea.ref {
		height: 5rem;
		resize: none;
	}

	.te-add {
		padding: var(--ds-space-md);
	}
	.te-add .add {
		width: 100%;
		border-style: dashed;
	}

	.file-btn input {
		display: none;
	}
	/* 변경·삭제 버튼: 나란히 · 동일 너비 */
	.image-actions {
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: 1fr;
		gap: var(--ds-space-xs);
	}

	.date-field {
		display: grid;
		gap: var(--ds-space-2xs);
	}
	.date-field span {
		font-size: var(--ds-text-sm);
		color: var(--ds-color-ink-3);
	}
	.date-field input {
		width: 100%;
	}
	/* 다크모드에서 기본 달력 아이콘(어두움)이 안 보여 반전한다 */
	@media (prefers-color-scheme: dark) {
		:global(:root:not([data-theme='light'])) .date-field input::-webkit-calendar-picker-indicator {
			filter: invert(1);
		}
	}
	:global(:root[data-theme='dark']) .date-field input::-webkit-calendar-picker-indicator {
		filter: invert(1);
	}
	/* 빈 날짜(mm/dd/yyyy)는 placeholder처럼 흐리게 */
	.date-field input.is-empty {
		color: var(--ds-color-ink-4);
	}

	/* 미리보기: 셀 안 중앙, 크기 상·하한 (레이아웃 안정) */
	.image-preview {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 120px;
		max-height: 240px;
		padding: var(--ds-space-sm);
		background: var(--ds-color-hover);
		border-radius: var(--ds-radius-sm);
	}
	.image-preview img {
		max-width: 100%;
		max-height: 224px;
		width: auto;
		height: auto;
		object-fit: contain;
		border-radius: var(--ds-radius-sm);
	}

	.ghost,
	.file-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font: inherit;
		font-size: var(--ds-text-sm);
		color: var(--ds-color-ink-2);
		background: none;
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		border-radius: var(--ds-radius-md);
		padding: var(--ds-space-2xs) var(--ds-space-sm);
		cursor: pointer;
		transition: border-color var(--ds-duration-short) var(--ds-ease-out);
	}
	.ghost:hover,
	.file-btn:hover {
		border-color: var(--ds-color-border-3);
		color: var(--ds-color-ink-1);
	}

	.hint {
		margin: 0;
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-4);
	}
	.hint.warn {
		color: var(--ds-color-spark);
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
