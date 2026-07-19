type RevisionType = 'add' | 'edit' | 'revert';

// 영상(YouTube). id·orientation에서 썸네일·URL을 파생한다.
interface WikiVideo {
	id: string;
	title: string;
	description: string;
	uploadDate: string;
	orientation?: 'portrait' | 'landscape';
}

// 편집 대상 필드(스냅샷 단위). slug·title은 생성 후 고정이나 스냅샷에는 포함된다.
interface WikiFields {
	slug: string;
	title: string;
	summary: string;
	category: string;
	related: string[];
	mainImage: string | null;
	video: WikiVideo | null;
	body: string;
}

interface WikiAuthor {
	id: string;
	displayName: string;
}

interface WikiTermData extends WikiFields {
	id: number;
	author: WikiAuthor;
	createdAt: string;
	updatedAt: string;
}

// Supabase select 결과 (wiki_terms + profiles 조인)
interface WikiTermRow {
	id: number;
	slug: string;
	title: string;
	summary: string;
	category: string;
	related: string[] | null;
	main_image: string | null;
	video: WikiVideo | null;
	body: string;
	author_id: string;
	created_at: string;
	updated_at: string;
	profiles: { display_name: string } | null;
}

// 이력 한 줄(목록·상세)
interface WikiRevisionData extends WikiFields {
	id: number;
	termId: number;
	type: RevisionType;
	editor: WikiAuthor;
	comment: string | null;
	revertedFrom: number | null;
	createdAt: string;
}

// wiki_revisions 행에는 slug 컬럼이 없다(스냅샷은 title 등만). WikiRevision.fromRow는 slug를 ''로 채운다 —
// 되돌리기는 term_id로 대상을 고정하므로 revision의 slug는 쓰이지 않는다.
interface WikiRevisionRow {
	id: number;
	term_id: number;
	type: RevisionType;
	title: string;
	summary: string;
	category: string;
	related: string[] | null;
	main_image: string | null;
	video: WikiVideo | null;
	body: string;
	editor_id: string;
	comment: string | null;
	reverted_from_revision_id: number | null;
	created_at: string;
	profiles: { display_name: string } | null;
}

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
	get category() {
		return this.data.category;
	}
	get related() {
		return this.data.related;
	}
	get mainImage() {
		return this.data.mainImage;
	}
	get video() {
		return this.data.video;
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
			related: [...this.data.related],
			author: { ...this.data.author }
		};
	}

	// 편집 입력으로 변환 (수정 시 스냅샷 시작점)
	toFields(): WikiFields {
		const { slug, title, summary, category, related, mainImage, video, body } = this.data;
		return { slug, title, summary, category, related: [...related], mainImage, video, body };
	}

	static fromRow(row: WikiTermRow): WikiTerm {
		return new WikiTerm({
			id: row.id,
			slug: row.slug,
			title: row.title,
			summary: row.summary,
			category: row.category,
			related: row.related ?? [],
			mainImage: row.main_image,
			video: row.video,
			body: row.body,
			author: { id: row.author_id, displayName: row.profiles?.display_name ?? '익명' },
			createdAt: row.created_at,
			updatedAt: row.updated_at
		});
	}
}

class WikiRevision {
	private data: WikiRevisionData;
	constructor(data: WikiRevisionData) {
		this.data = data;
	}
	get id() {
		return this.data.id;
	}
	get termId() {
		return this.data.termId;
	}
	get type() {
		return this.data.type;
	}
	get editor() {
		return this.data.editor;
	}
	get comment() {
		return this.data.comment;
	}
	get revertedFrom() {
		return this.data.revertedFrom;
	}
	get createdAt() {
		return this.data.createdAt;
	}
	get title() {
		return this.data.title;
	}
	get body() {
		return this.data.body;
	}

	toData(): WikiRevisionData {
		return {
			...this.data,
			related: [...this.data.related],
			editor: { ...this.data.editor }
		};
	}
	toFields(): WikiFields {
		const { slug, title, summary, category, related, mainImage, video, body } = this.data;
		return { slug, title, summary, category, related: [...related], mainImage, video, body };
	}

	static fromRow(row: WikiRevisionRow): WikiRevision {
		return new WikiRevision({
			id: row.id,
			termId: row.term_id,
			type: row.type,
			slug: '',
			title: row.title,
			summary: row.summary,
			category: row.category,
			related: row.related ?? [],
			mainImage: row.main_image,
			video: row.video,
			body: row.body,
			editor: { id: row.editor_id, displayName: row.profiles?.display_name ?? '익명' },
			comment: row.comment,
			revertedFrom: row.reverted_from_revision_id,
			createdAt: row.created_at
		});
	}
}

export { WikiTerm, WikiRevision };
export type {
	RevisionType,
	WikiVideo,
	WikiFields,
	WikiAuthor,
	WikiTermData,
	WikiTermRow,
	WikiRevisionData,
	WikiRevisionRow
};
