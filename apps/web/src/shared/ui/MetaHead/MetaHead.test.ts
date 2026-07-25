import { describe, it, expect } from 'vitest';
import { render } from 'svelte/server';
import MetaHead from './MetaHead.svelte';

// 공유 카드가 어긋나는 사고는 대개 크기·타입 태그에서 난다. head 산출물을 직접 본다.
function head(props: Record<string, unknown>): string {
	return render(MetaHead, { props: props as never }).head;
}

describe('MetaHead 이미지 크기 태그', () => {
	it('우리가 만든 /og/*.png는 1200×630을 함께 알린다', () => {
		const markup = head({ title: '제목', description: '설명', path: '/wiki', image: '/og/wiki.png' });
		expect(markup).toContain('og:image:width" content="1200"');
		expect(markup).toContain('og:image:height" content="630"');
	});

	it('업로드·외부 이미지는 크기를 모르므로 알리지 않는다', () => {
		const markup = head({
			title: '제목',
			description: '설명',
			path: '/wiki/x',
			image: 'https://cdn.example.com/uploaded.png'
		});
		expect(markup).toContain('og:image" content="https://cdn.example.com/uploaded.png"');
		expect(markup).not.toContain('og:image:width');
		expect(markup).not.toContain('og:image:height');
	});
});

describe('MetaHead article 메타', () => {
	it('type=article일 때만 발행·수정·작성자를 알린다', () => {
		const props = {
			title: '제목',
			description: '설명',
			path: '/community/1',
			publishedTime: '2026-07-20T00:00:00Z',
			modifiedTime: '2026-07-21T00:00:00Z',
			authorName: '제프'
		};
		const asArticle = head({ ...props, type: 'article' });
		expect(asArticle).toContain('og:type" content="article"');
		expect(asArticle).toContain('article:published_time" content="2026-07-20T00:00:00Z"');
		expect(asArticle).toContain('article:modified_time" content="2026-07-21T00:00:00Z"');
		expect(asArticle).toContain('article:author" content="제프"');

		const asWebsite = head(props);
		expect(asWebsite).toContain('og:type" content="website"');
		expect(asWebsite).not.toContain('article:published_time');
		expect(asWebsite).not.toContain('article:author');
	});
});

describe('MetaHead 색인·대체 텍스트', () => {
	it('noindex를 넘기면 robots 메타를 붙이고, 기본값에서는 붙이지 않는다', () => {
		const props = { title: '로그인', description: '설명', path: '/login' };
		expect(head({ ...props, noindex: true })).toContain('name="robots" content="noindex, nofollow"');
		expect(head(props)).not.toContain('name="robots"');
	});

	it('imageAlt는 og·twitter 양쪽에 붙는다', () => {
		const markup = head({
			title: '제목',
			description: '설명',
			path: '/wiki/x',
			image: '/og/wiki.png',
			imageAlt: '누룩 사진'
		});
		expect(markup).toContain('og:image:alt" content="누룩 사진"');
		expect(markup).toContain('twitter:image:alt" content="누룩 사진"');
	});

	it('전 페이지 공통으로 사이트명과 언어를 알린다', () => {
		const markup = head({ title: '제목', description: '설명', path: '/' });
		expect(markup).toContain('og:site_name" content="알콜미터"');
		expect(markup).toContain('og:locale" content="ko_KR"');
	});
});
