import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';

const md = new MarkdownIt({ html: false, linkify: true, breaks: false });
// 링크 스킴 안전성은 sanitize-html에 일임(아래 allowedSchemes가 차단)
md.validateLink = () => true;

const WIKI_LINK = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
const MISSING = /%%WIKIMISSING:([^%]*)%%/g;

// 파싱 전: 존재 slug는 마크다운 링크로, 없는 slug는 살아남는 토큰으로 치환한다.
function preTransform(source: string, slugs: Set<string>): string {
	return source.replace(WIKI_LINK, (_m, rawTarget, rawLabel) => {
		const slug = String(rawTarget).trim();
		const label = String(rawLabel ?? rawTarget).trim();
		return slugs.has(slug) ? `[${label}](/wiki/${encodeURIComponent(slug)})` : `%%WIKIMISSING:${label}%%`;
	});
}

function renderWiki(markdown: string, slugs: Set<string>): string {
	const rendered = md.render(preTransform(markdown, slugs));
	// /wiki 링크에 클래스 부여 + missing 토큰을 스팬으로
	const classed = rendered
		.replace(/<a href="\/wiki\//g, '<a class="wiki-link" href="/wiki/')
		.replace(MISSING, (_m, label) => `<span class="wiki-link wiki-link--missing" title="아직 작성되지 않은 용어">${label}</span>`);
	return sanitizeHtml(classed, {
		allowedTags: ['p', 'h1', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'blockquote', 'strong', 'em', 'code', 'pre', 'a', 'span', 'img', 'hr', 'br', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
		allowedAttributes: {
			a: ['href', 'class', 'title'],
			span: ['class', 'title'],
			img: ['src', 'alt']
		},
		allowedClasses: { a: ['wiki-link'], span: ['wiki-link', 'wiki-link--missing'] },
		allowedSchemes: ['http', 'https'],
		// 이미지는 우리 스토리지·유튜브 썸네일만
		allowedSchemesByTag: { img: ['https'] },
		transformTags: {
			a: (tagName, attribs) => {
				// 외부 링크는 안전속성 부여, 내부(/wiki)는 그대로
				if (attribs.href && /^https?:\/\//.test(attribs.href)) {
					return { tagName, attribs: { ...attribs, rel: 'nofollow noopener', target: '_blank' } };
				}
				return { tagName, attribs };
			}
		}
	});
}

export { renderWiki };
