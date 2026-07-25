import { describe, it, expect } from 'vitest';
import { JsonLd } from './JsonLd';

// 사용자 콘텐츠(용어 제목·요약)가 JSON-LD로 head에 {@html} 주입되므로, </script> 조기 종료를 막아야 한다.
describe('JsonLd XSS 방지', () => {
	it('DefinedTerm 필드의 </script>를 이스케이프해 script 조기 종료를 막는다', () => {
		const markup = JsonLd.createDefinedTermSchemaMarkup({
			name: '</script><script>alert(1)</script>',
			description: '설명',
			url: 'https://alcolmeter.kr/wiki/x'
		});
		expect(markup.match(/<script/g)?.length).toBe(1); // 여는 태그 하나뿐
		expect(markup).not.toContain('</script><script>');
		expect(markup).toContain('\\u003c/script');
	});

	it('DefinedTermSet의 용어 필드도 이스케이프한다', () => {
		const markup = JsonLd.createDefinedTermSetSchemaMarkup({
			name: '세트',
			description: '설명',
			url: 'https://alcolmeter.kr/wiki',
			terms: [{ name: '</script>', description: 'd', url: 'https://alcolmeter.kr/wiki/y' }]
		});
		expect(markup.match(/<script/g)?.length).toBe(1);
		expect(markup.match(/<\/script>/g)?.length).toBe(1); // 래퍼의 닫는 태그 하나뿐(주입분은 이스케이프됨)
	});

	it('커뮤니티 글의 제목·작성자도 이스케이프한다', () => {
		const markup = JsonLd.createDiscussionForumPostingSchemaMarkup({
			headline: '</script><script>alert(1)</script>',
			description: '요약',
			url: 'https://alcolmeter.kr/community/1',
			datePublished: '2026-07-26T00:00:00Z',
			dateModified: '2026-07-26T00:00:00Z',
			authorName: '</script>'
		});
		expect(markup.match(/<script/g)?.length).toBe(1);
		expect(markup.match(/<\/script>/g)?.length).toBe(1);
	});
});

describe('JsonLd 전역 스키마', () => {
	it('Organization은 로고·설명을 담고 sameAs가 없으면 생략한다', () => {
		const markup = JsonLd.createOrganizationSchemaMarkup({
			name: '알콜미터',
			url: 'https://alcolmeter.kr',
			logo: 'https://alcolmeter.kr/favicon.svg',
			description: '설명'
		});
		expect(markup).toContain('"@type":"Organization"');
		expect(markup).toContain('"logo":"https://alcolmeter.kr/favicon.svg"');
		expect(markup).not.toContain('sameAs');
	});

	it('WebSite는 발행 주체와 언어를 담는다', () => {
		const markup = JsonLd.createWebSiteSchemaMarkup({
			name: '알콜미터',
			url: 'https://alcolmeter.kr',
			description: '설명',
			publisherName: '알콜미터'
		});
		expect(markup).toContain('"@type":"WebSite"');
		expect(markup).toContain('"inLanguage":"ko-KR"');
		expect(markup).toContain('"publisher"');
	});
});

describe('JsonLd 커뮤니티 글 스키마', () => {
	it('작성자와 발행·수정 시각을 담는다', () => {
		const markup = JsonLd.createDiscussionForumPostingSchemaMarkup({
			headline: '첫 글',
			description: '요약',
			url: 'https://alcolmeter.kr/community/1',
			datePublished: '2026-07-20T00:00:00Z',
			dateModified: '2026-07-21T00:00:00Z',
			authorName: '제프'
		});
		expect(markup).toContain('"@type":"DiscussionForumPosting"');
		expect(markup).toContain('"datePublished":"2026-07-20T00:00:00Z"');
		expect(markup).toContain('"dateModified":"2026-07-21T00:00:00Z"');
		expect(markup).toContain('"name":"제프"');
		expect(markup).not.toContain('"image"');
	});
});
