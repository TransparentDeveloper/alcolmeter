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

/** 카테고리 → 용어 목록 (인덱스 그룹핑용) */
export type CategoryGroup = {
	category: string;
	items: TermMeta[];
};
