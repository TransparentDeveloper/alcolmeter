import type { PolicySection } from '../model';

// 운영정책의 섹션 목록. 순서·id·제목의 단일 출처다.
// 본문과 목차를 함께 그리는 shared/ui/LegalDocument가 이 목록을 소비한다.
const sections: PolicySection[] = [
	{ id: 'scope', title: '이 정책의 위치' },
	{ id: 'community', title: '커뮤니티 글 작성 기준' },
	{ id: 'wiki', title: '알콜위키 편집 규칙' },
	{ id: 'revert', title: '되돌리기와 문서 삭제' },
	{ id: 'report', title: '신고' },
	{ id: 'action', title: '조치 단계' },
	{ id: 'appeal', title: '이의 제기' },
	{ id: 'revision', title: '정책 변경' }
];

export { sections };
