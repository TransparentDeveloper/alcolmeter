import type { TermMeta, CategoryGroup } from '../model';

// frontmatter(metadata)만 eager 로드한다 — 본문 컴포넌트는 api/content에서 지연 로드.
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

/** 카테고리 → 용어 목록 (등장 순서 유지) */
export function termsByCategory(items: TermMeta[] = terms): CategoryGroup[] {
	const groups: CategoryGroup[] = [];
	for (const term of items) {
		let group = groups.find((g) => g.category === term.category);
		if (!group) {
			group = { category: term.category, items: [] };
			groups.push(group);
		}
		group.items.push(term);
	}
	return groups;
}
