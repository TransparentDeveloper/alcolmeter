import type { TermsSection } from '../model';

// 이용약관의 섹션 목록. 순서·id·제목의 단일 출처다.
// 본문과 목차를 함께 그리는 shared/ui/LegalDocument가 이 목록을 소비한다.
const sections: TermsSection[] = [
	{ id: 'purpose', title: '목적' },
	{ id: 'service', title: '서비스와 운영주체' },
	{ id: 'account', title: '계정' },
	{ id: 'content', title: '이용자 저작물' },
	{ id: 'prohibited', title: '금지 행위' },
	{ id: 'moderation', title: '게시물 삭제와 이용 제한' },
	{ id: 'changes', title: '서비스 변경·중단' },
	{ id: 'disclaimer', title: '면책' },
	{ id: 'privacy', title: '개인정보' },
	{ id: 'revision', title: '약관 변경' },
	{ id: 'governing', title: '준거법과 분쟁 해결' }
];

export { sections };
