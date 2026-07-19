import MarkdownIt from 'markdown-it';
import markdownItCjkFriendly from 'markdown-it-cjk-friendly';
import sanitizeHtml from 'sanitize-html';

const md = new MarkdownIt({ html: false, linkify: true, breaks: false });
// 링크 스킴 안전성은 sanitize-html에 일임(아래 allowedSchemes가 차단)
md.validateLink = () => true;
// CJK(한글 등)에서 문장부호·괄호 뒤 `**`가 닫히지 않는 CommonMark emphasis flanking 한계 보정
md.use(markdownItCjkFriendly);

const WIKI_LINK = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
const MISSING = /%%WIKIMISSING:([^%]*)%%/g;
const VIDEO_LINE = /^::youtube\{id=([A-Za-z0-9_-]{6,})\}\s*$/gm;
const VIDEO_TOKEN = /%%WIKIVIDEO:([A-Za-z0-9_-]+)%%/g;

// 파싱 전: 자체 줄의 영상 지시자와 존재 slug는 살아남는 토큰/링크로, 없는 slug는 살아남는 토큰으로 치환한다.
function preTransform(source: string, slugs: Set<string>): string {
	const withVideo = source.replace(VIDEO_LINE, (_m, id) => `%%WIKIVIDEO:${id}%%`);
	return withVideo.replace(WIKI_LINK, (_m, rawTarget, rawLabel) => {
		const slug = String(rawTarget).trim();
		const label = String(rawLabel ?? rawTarget).trim();
		return slugs.has(slug) ? `[${label}](/wiki/${encodeURIComponent(slug)})` : `%%WIKIMISSING:${label}%%`;
	});
}

function renderWiki(markdown: string, slugs: Set<string>): string {
	const rendered = md.render(preTransform(markdown, slugs));
	// /wiki 링크에 클래스 부여 + missing 토큰을 스팬으로 + 영상 토큰을 썸네일 파사드로
	const classed = rendered
		.replace(/<a href="\/wiki\//g, '<a class="wiki-link" href="/wiki/')
		.replace(MISSING, (_m, label) => `<span class="wiki-link wiki-link--missing" title="아직 작성되지 않은 용어">${label}</span>`)
		.replace(
			VIDEO_TOKEN,
			(_m, id) =>
				`<a class="wiki-video" href="https://www.youtube.com/watch?v=${id}">` +
				`<img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="영상 재생" /></a>`
		);
	return sanitizeHtml(classed, {
		allowedTags: ['p', 'h1', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'blockquote', 'strong', 'em', 'code', 'pre', 'a', 'span', 'img', 'hr', 'br', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
		allowedAttributes: {
			a: ['href', 'class', 'title'],
			span: ['class', 'title'],
			img: ['src', 'alt']
		},
		allowedClasses: { a: ['wiki-link', 'wiki-video'], span: ['wiki-link', 'wiki-link--missing'] },
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
