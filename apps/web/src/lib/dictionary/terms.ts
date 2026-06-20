export type TermMeta = {
	/** 표시 이름 (예: 고두밥) */
	title: string;
	/** URL 세그먼트 = 한글 slug (예: 고두밥) */
	slug: string;
	/** 한 줄 정의 — meta description / DefinedTerm.description / 인덱스 미리보기에 공용 */
	summary: string;
	/** 분류: 쌀 형태 / 양조 방식 / 재료·공정 / 개념 */
	category: string;
	/** 술 갈래(도메인). 공유 용어는 복수 (예: [전통주, 증류주]). URL은 평면 유지하고 도메인은 태그로만 표현 */
	domain: string[];
	/** 인덱스 정렬 순서 (작을수록 먼저). 없으면 맨 뒤 + 가나다 */
	order?: number;
	/** 관련 용어 (slug 배열) */
	related?: string[];
	/** 최종 수정일 YYYY-MM-DD */
	updated?: string;
};

// frontmatter(metadata)만 eager 로드한다 — 본문 컴포넌트는 [slug] 라우트에서 지연 로드.
const metaModules = import.meta.glob('/src/content/dictionary/*.md', {
	eager: true,
	import: 'metadata'
}) as Record<string, TermMeta>;

/** 전체 용어 (order 오름차순, 같으면 가나다) */
export const terms: TermMeta[] = Object.values(metaModules).sort((a, b) => {
	const ao = a.order ?? Number.MAX_SAFE_INTEGER;
	const bo = b.order ?? Number.MAX_SAFE_INTEGER;
	return ao - bo || a.title.localeCompare(b.title, 'ko');
});

/** 존재하는 slug 집합 (관련용어 링크의 유효성 판별용) */
export const termSlugs = new Set(terms.map((t) => t.slug));

export function getTerm(slug: string): TermMeta | undefined {
	return terms.find((t) => t.slug === slug);
}

/** 카테고리 → 용어 목록 (인덱스 그룹핑용, 카테고리 등장 순서 유지) */
export function termsByCategory(): { category: string; items: TermMeta[] }[] {
	const groups: { category: string; items: TermMeta[] }[] = [];
	for (const term of terms) {
		let group = groups.find((g) => g.category === term.category);
		if (!group) {
			group = { category: term.category, items: [] };
			groups.push(group);
		}
		group.items.push(term);
	}
	return groups;
}
