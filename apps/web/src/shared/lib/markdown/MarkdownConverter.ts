import MarkdownIt from 'markdown-it';
import markdownItCjkFriendly from 'markdown-it-cjk-friendly';
import sanitizeHtml from 'sanitize-html';

// 수정 진입 시 저장된 마크다운을 편집용 HTML로 되돌린다(에디터 seed 전용, 저장 경로엔 안 씀).
// wiki-render(조회 렌더)와 별개: linkify·위키링크·영상 해석 없이 에디터 서브셋만 살린다.
const md = new MarkdownIt({ html: false, linkify: false, breaks: false });
// 라운드트립 안정성: fromDom이 만든 CJK 볼드('**…(漢字)**')를 되읽을 때 필요 (wiki-render와 동일 보정)
md.use(markdownItCjkFriendly);

class MarkdownConverter {
	static toHtml(source: string): string {
		return sanitizeHtml(md.render(source), {
			allowedTags: [
				'p',
				'h1',
				'h2',
				'h3',
				'h4',
				'ul',
				'ol',
				'li',
				'strong',
				'em',
				'b',
				'i',
				's',
				'del',
				'a',
				'hr',
				'br',
				'blockquote',
				'code',
				'table',
				'thead',
				'tbody',
				'tr',
				'th',
				'td'
			],
			// 열 정렬은 markdown-it이 셀에 붙이는 인라인 style로 나른다(클래스 배관을 새로 깔지 않는다)
			allowedAttributes: { a: ['href'], th: ['style'], td: ['style'] },
			allowedStyles: { '*': { 'text-align': [/^left$/, /^center$/, /^right$/] } },
			allowedSchemes: ['http', 'https']
		});
	}
}

export { MarkdownConverter };
