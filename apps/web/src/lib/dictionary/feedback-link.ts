// 용어사전 수정요청 구글폼 prefill 링크 빌더.
// 폼에 '용어' 단답 항목을 두고, 그 entry ID로 현재 용어명을 미리 채운다.
const FORM_BASE =
	'https://docs.google.com/forms/d/e/1FAIpQLSctRt_NXngjhIsFfe53iHbh_H84Dfpc6KPJ0TcjWF0jtlaR3g/viewform';
const TERM_ENTRY = 'entry.494381841';

export function buildFeedbackUrl(term: string): string {
	const params = new URLSearchParams({ usp: 'pp_url', [TERM_ENTRY]: term });
	return `${FORM_BASE}?${params.toString()}`;
}
