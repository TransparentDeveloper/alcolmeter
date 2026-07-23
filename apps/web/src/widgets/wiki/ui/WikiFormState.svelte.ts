import type { SupabaseClient } from '@supabase/supabase-js';
import type { WikiFields, WikiVideo, WikiInfoRow, InfoRowKeyType } from '$entities/wiki/model';
import { WikiAPI } from '$entities/wiki/api';
import { toSlug, videoWatchUrl, parseYoutubeUrl } from '$entities/wiki/lib';

// 위키 편집 폼 상태. 작성(제목 편집 가능)·수정(제목 고정) 공용.
class WikiFormState {
	readonly isNew: boolean;
	title = $state('');
	summary = $state('');
	body = $state('');

	// 대표이미지: 기존 URL(수정 시) 또는 새로 고른 파일(제출 시 업로드). alt는 선택.
	imageUrl = $state<string | null>(null);
	imageAlt = $state('');
	pendingImageFile = $state<File | null>(null);
	// $state여야 미리보기 게터(imagePreviewSrc)가 파일 선택에 반응한다.
	private pendingPreviewUrl = $state<string | null>(null);

	// 대표영상: 유튜브 URL + 메타(제목·설명·게시일). id·orientation은 URL에서 파생.
	videoUrl = $state('');
	videoTitle = $state('');
	videoDescription = $state('');
	videoUploadDate = $state('');

	// 다른 이름·참고 링크 — 콤마 구분 단일 입력(고정 행). 저장 시 info_rows의 alternateName·sameAs 행으로 매핑.
	alternateName = $state('');
	sameAs = $state('');
	// 사용자 임의 행(text만). alternateName·sameAs는 위 고정 필드가 담당.
	infoRows = $state<WikiInfoRow[]>([]);

	constructor(init?: Partial<WikiFields> & { isNew?: boolean }) {
		this.isNew = init?.isNew ?? false;
		if (init) {
			this.title = init.title ?? '';
			this.summary = init.summary ?? '';
			this.body = init.body ?? '';
			this.imageUrl = init.mainImage?.url ?? null;
			this.imageAlt = init.mainImage?.alt ?? '';
			if (init.video) {
				this.videoUrl = videoWatchUrl(init.video);
				this.videoTitle = init.video.title;
				this.videoDescription = init.video.description;
				this.videoUploadDate = init.video.uploadDate;
			}
			const rows = init.infoRows ?? [];
			this.alternateName = rows
				.filter((r) => r.key === 'alternateName')
				.map((r) => r.value)
				.join(', ');
			this.sameAs = rows
				.filter((r) => r.key === 'sameAs')
				.map((r) => r.value)
				.join(', ');
			this.infoRows = rows.filter((r) => r.key === 'text').map((r) => ({ ...r }));
		}
	}

	get slug(): string {
		return toSlug(this.title);
	}
	get isValid(): boolean {
		return this.slug.length > 0 && this.body.trim().length > 0;
	}

	// 미리보기·파싱 게터
	get videoId(): string | null {
		return parseYoutubeUrl(this.videoUrl).id;
	}
	get imagePreviewSrc(): string | null {
		return this.pendingPreviewUrl ?? this.imageUrl;
	}

	// 대표이미지 파일 선택/해제 (로컬 미리보기 URL 관리)
	setImageFile(file: File | null): void {
		if (this.pendingPreviewUrl) {
			URL.revokeObjectURL(this.pendingPreviewUrl);
			this.pendingPreviewUrl = null;
		}
		this.pendingImageFile = file;
		if (file) this.pendingPreviewUrl = URL.createObjectURL(file);
	}
	clearImage(): void {
		this.setImageFile(null);
		this.imageUrl = null;
		this.imageAlt = '';
	}
	// 제출 직전 호출: 대기 중인 파일이 있으면 업로드하고 URL을 확정한다.
	async commitImage(client: SupabaseClient): Promise<void> {
		if (!this.pendingImageFile) return;
		this.imageUrl = await WikiAPI.uploadImage(client, this.pendingImageFile);
		this.setImageFile(null);
	}

	// 임의 행 조작
	addRow(key: InfoRowKeyType = 'text'): void {
		this.infoRows = [...this.infoRows, { key, label: '', value: '' }];
	}
	removeRow(index: number): void {
		this.infoRows = this.infoRows.filter((_, i) => i !== index);
	}

	private toVideo(): WikiVideo | null {
		const { id, orientation } = parseYoutubeUrl(this.videoUrl);
		if (!id) return null;
		return {
			id,
			title: this.videoTitle.trim(),
			description: this.videoDescription.trim(),
			uploadDate: this.videoUploadDate,
			orientation
		};
	}

	// 고정 필드(다른 이름·참고 링크) + 사용자 임의 행(text)을 info_rows로. 빈 값 제외.
	// 고정 행 라벨은 뷰에서 관리하므로 ''로 두고 렌더가 기본 라벨로 대체한다.
	private buildInfoRows(): WikiInfoRow[] {
		const rows: WikiInfoRow[] = [];
		const alt = this.alternateName.trim();
		if (alt) rows.push({ key: 'alternateName', label: '', value: alt });
		const ref = this.sameAs.trim();
		if (ref) rows.push({ key: 'sameAs', label: '', value: ref });
		for (const r of this.infoRows) {
			const value = r.value.trim();
			if (value) rows.push({ key: r.key, label: r.label.trim(), value });
		}
		return rows;
	}

	toFields(): WikiFields {
		return {
			slug: this.slug,
			title: this.title.trim(),
			summary: this.summary.trim(),
			mainImage: this.imageUrl ? { url: this.imageUrl, alt: this.imageAlt.trim() } : null,
			video: this.toVideo(),
			infoRows: this.buildInfoRows(),
			body: this.body
		};
	}
}

export { WikiFormState };
