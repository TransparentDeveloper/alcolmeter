import type { PrivacySection } from '../model';

// 개인정보처리방침의 섹션 목록. 순서·id·제목의 단일 출처다.
// 본문(widgets/privacy/ui/PrivacyPolicy)과 목차(PrivacyToc)가 이 목록을 함께 소비한다.
const sections: PrivacySection[] = [
	{ id: 'overview', title: '개요' },
	{ id: 'items', title: '수집하는 개인정보 항목' },
	{ id: 'purpose', title: '개인정보의 이용 목적' },
	{ id: 'processors', title: '처리 위탁 및 국외 이전' },
	{ id: 'retention', title: '보유·이용 기간 및 파기' },
	{ id: 'rights', title: '이용자의 권리와 행사 방법' },
	{ id: 'cookies', title: '쿠키 등 자동 수집' },
	{ id: 'contact', title: '문의' }
];

export { sections };
