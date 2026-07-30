interface PostAuthor {
	id: string;
	displayName: string;
}

interface PostData {
	id: number;
	title: string;
	body: string; // 마크다운
	author: PostAuthor;
	createdAt: string;
	updatedAt: string;
}

// 목록·홈 피드용 경량 뷰 (본문 대신 요약만 담는다)
interface PostListItem {
	id: number;
	title: string;
	summary: string;
	authorName: string;
	createdAt: string;
}

// Supabase select 결과 형태 (posts + profiles 조인)
interface PostRow {
	id: number;
	title: string;
	body: string | null;
	author_id: string;
	created_at: string;
	updated_at: string;
	profiles: { display_name: string } | null;
}

const SUMMARY_LIMIT = 100;
const FIRST_IMAGE = /!\[[^\]]*\]\(\s*([^)\s]+)/;

class PostModel {
	private data: PostData;

	constructor(data: PostData) {
		this.data = data;
	}

	get id(): number {
		return this.data.id;
	}

	get title(): string {
		return this.data.title;
	}

	get body(): string {
		return this.data.body;
	}

	get author(): PostAuthor {
		return this.data.author;
	}

	get createdAt(): string {
		return this.data.createdAt;
	}

	get updatedAt(): string {
		return this.data.updatedAt;
	}

	// 목록·공유 메타용 요약: 마크다운 표시 기호를 걷어낸 평문 앞 100자.
	get summary(): string {
		const text = PostModel.toPlainText(this.data.body);
		return text.length > SUMMARY_LIMIT ? `${text.slice(0, SUMMARY_LIMIT)}…` : text;
	}

	// 공유 카드용 대표 이미지: 본문 첫 이미지. 없으면 null(커뮤니티 공통 이미지로 폴백한다).
	get shareImage(): string | null {
		return this.data.body.match(FIRST_IMAGE)?.[1] ?? null;
	}

	toData(): PostData {
		return { ...this.data, author: { ...this.data.author } };
	}

	static fromRow(row: PostRow): PostModel {
		return new PostModel({
			id: row.id,
			title: row.title,
			body: row.body ?? '',
			author: { id: row.author_id, displayName: row.profiles?.display_name ?? '익명' },
			createdAt: row.created_at,
			updatedAt: row.updated_at
		});
	}

	// 요약용 평문화. 렌더가 아니라 발췌 목적이라 완전한 마크다운 파싱은 하지 않는다.
	private static toPlainText(markdown: string): string {
		return markdown
			.replace(/!\[[^\]]*\]\([^)]*\)/g, '') // 이미지
			.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_m, slug, label) => label ?? slug) // 위키링크
			.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // 링크 → 표시 문구
			.replace(/^\s*([-*_]\s*){3,}$/gm, '') // 구분선
			.replace(/^[\s|:-]*-[\s|:-]*$/gm, '') // 표 구분행 (파이프가 섞여 구분선 규칙에 안 걸린다)
			// 셀 구분자는 공백으로. 이스케이프 토큰을 먼저 삼켜야 '\|'가 구분자로 오인되지 않는다.
			.replace(/\\([\\|])|\|/g, (_m, escaped) => escaped ?? ' ')
			.replace(/^\s{0,3}(#{1,6}\s+|>\s?|[-*+]\s+|\d+\.\s+)/gm, '') // 블록 마커
			.replace(/(\*\*|__|~~)([^\n]*?)\1/g, '$2') // 굵게·취소선
			.replace(/_([^_\n]+)_/g, '$1') // 기울임 (에디터가 밑줄로 쓴다)
			.replace(/[*`]/g, '') // 남은 강조 기호
			.replace(/\s+/g, ' ')
			.trim();
	}
}

export { PostModel };
export type { PostAuthor, PostData, PostListItem, PostRow };
