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
	/** 소개 영상 (YouTube). 있으면 용어 페이지에 임베드 + VideoObject JSON-LD */
	video?: TermVideo;
};

/** 용어 소개 영상 (YouTube). 썸네일·임베드 URL은 id·orientation에서 파생한다. */
export type TermVideo = {
	/** YouTube 영상/쇼츠 ID */
	id: string;
	/** 영상 제목 — VideoObject.name, figcaption */
	title: string;
	/** 영상 설명 — VideoObject.description */
	description: string;
	/** 게시일 YYYY-MM-DD — VideoObject.uploadDate */
	uploadDate: string;
	/** 영상 방향. 'portrait'=쇼츠(9:16, 기본), 'landscape'=일반 영상(16:9) */
	orientation?: 'portrait' | 'landscape';
};

/** 쇼츠(세로)인가. orientation 미지정 시 기본 portrait. */
export function isPortraitVideo(video: TermVideo): boolean {
	return (video.orientation ?? 'portrait') === 'portrait';
}

/**
 * 썸네일 URL 후보 [기본, 폴백]. 표시(첫 항목 + onerror 폴백)와 VideoObject.thumbnailUrl에 공용.
 * 쇼츠는 세로 oardefault, 일반 영상은 16:9 maxresdefault를 우선한다.
 */
export function videoThumbnails(video: TermVideo): [string, string] {
	const base = `https://i.ytimg.com/vi/${video.id}`;
	return isPortraitVideo(video)
		? [`${base}/oardefault.jpg`, `${base}/maxresdefault.jpg`]
		: [`${base}/maxresdefault.jpg`, `${base}/hqdefault.jpg`];
}

/** 시청 페이지 URL. 쇼츠는 /shorts/, 일반 영상은 /watch?v=. */
export function videoWatchUrl(video: TermVideo): string {
	return isPortraitVideo(video)
		? `https://www.youtube.com/shorts/${video.id}`
		: `https://www.youtube.com/watch?v=${video.id}`;
}

/** 임베드(iframe·VideoObject.embedUrl) URL. 방향 무관. */
export function videoEmbedUrl(video: TermVideo): string {
	return `https://www.youtube.com/embed/${video.id}`;
}

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
