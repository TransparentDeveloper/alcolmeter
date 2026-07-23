import type { WikiImage, WikiVideo, WikiInfoRow, WikiFields, WikiTermData, WikiTermRow } from './type';

class WikiTerm {
	private data: WikiTermData;
	constructor(data: WikiTermData) {
		this.data = data;
	}
	get id() {
		return this.data.id;
	}
	get slug() {
		return this.data.slug;
	}
	get title() {
		return this.data.title;
	}
	get summary() {
		return this.data.summary;
	}
	get mainImage() {
		return this.data.mainImage;
	}
	get video() {
		return this.data.video;
	}
	get infoRows() {
		return this.data.infoRows;
	}
	get body() {
		return this.data.body;
	}
	get author() {
		return this.data.author;
	}
	get createdAt() {
		return this.data.createdAt;
	}
	get updatedAt() {
		return this.data.updatedAt;
	}

	toData(): WikiTermData {
		return {
			...this.data,
			mainImage: WikiTerm.cloneImage(this.data.mainImage),
			video: WikiTerm.cloneVideo(this.data.video),
			infoRows: WikiTerm.cloneRows(this.data.infoRows),
			author: { ...this.data.author }
		};
	}

	// 편집 입력으로 변환 (수정 시 스냅샷 시작점)
	toFields(): WikiFields {
		const { slug, title, summary, mainImage, video, infoRows, body } = this.data;
		return {
			slug,
			title,
			summary,
			mainImage: WikiTerm.cloneImage(mainImage),
			video: WikiTerm.cloneVideo(video),
			infoRows: WikiTerm.cloneRows(infoRows),
			body
		};
	}

	static fromRow(row: WikiTermRow): WikiTerm {
		return new WikiTerm({
			id: row.id,
			slug: row.slug,
			title: row.title,
			summary: row.summary,
			mainImage: row.main_image,
			video: row.video,
			infoRows: row.info_rows ?? [],
			body: row.body,
			author: { id: row.author_id, displayName: row.profiles?.display_name ?? '익명' },
			createdAt: row.created_at,
			updatedAt: row.updated_at
		});
	}

	// 스냅샷 필드 방어적 깊은 복사 (toData·toFields 공용, WikiRevision도 재사용)
	static cloneImage(image: WikiImage | null): WikiImage | null {
		return image ? { ...image } : null;
	}
	static cloneVideo(video: WikiVideo | null): WikiVideo | null {
		return video ? { ...video } : null;
	}
	static cloneRows(rows: WikiInfoRow[]): WikiInfoRow[] {
		return rows.map((r) => ({ ...r }));
	}
}

export { WikiTerm };
