type RevisionType = 'add' | 'edit' | 'revert';

// 대표이미지. url은 스토리지 공개 URL, alt는 이미지 SEO·접근성용(비면 제목으로 폴백).
interface WikiImage {
	url: string;
	alt: string;
}

// 영상(YouTube). id·orientation에서 썸네일·URL을 파생한다.
interface WikiVideo {
	id: string;
	title: string;
	description: string;
	uploadDate: string;
	orientation?: 'portrait' | 'landscape';
}

// 정보 테이블 행. key로 렌더/SEO 방출이 갈린다: alternateName·sameAs는 JSON-LD, text는 표시 전용.
type InfoRowKeyType = 'text' | 'alternateName' | 'sameAs';
interface WikiInfoRow {
	key: InfoRowKeyType;
	label: string;
	value: string;
}

// 편집 대상 필드(스냅샷 단위). slug·title은 생성 후 고정이나 스냅샷에는 포함된다.
interface WikiFields {
	slug: string;
	title: string;
	summary: string;
	mainImage: WikiImage | null;
	video: WikiVideo | null;
	infoRows: WikiInfoRow[];
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
	main_image: WikiImage | null;
	video: WikiVideo | null;
	info_rows: WikiInfoRow[] | null;
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
	main_image: WikiImage | null;
	video: WikiVideo | null;
	info_rows: WikiInfoRow[] | null;
	body: string;
	editor_id: string;
	comment: string | null;
	reverted_from_revision_id: number | null;
	created_at: string;
	profiles: { display_name: string } | null;
}

export type {
	RevisionType,
	WikiImage,
	WikiVideo,
	InfoRowKeyType,
	WikiInfoRow,
	WikiFields,
	WikiAuthor,
	WikiTermData,
	WikiTermRow,
	WikiRevisionData,
	WikiRevisionRow
};
