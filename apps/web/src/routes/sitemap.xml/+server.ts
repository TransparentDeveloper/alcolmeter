import { terms } from '$lib/dictionary/terms';
import type { RequestHandler } from './$types';

export const prerender = true;

const SITE = 'https://alcolmeter.kr';
const FALLBACK_DATE = '2026-06-20';

type Entry = { loc: string; lastmod: string; changefreq: string; priority: string };

// 고정 페이지. 새 정적 페이지가 생기면 여기에 추가한다.
const staticEntries: Entry[] = [
	{ loc: `${SITE}/`, lastmod: '2026-06-20', changefreq: 'daily', priority: '1.0' },
	{ loc: `${SITE}/makgeolli`, lastmod: '2026-06-20', changefreq: 'daily', priority: '0.9' },
	{ loc: `${SITE}/faq`, lastmod: '2026-06-20', changefreq: 'daily', priority: '0.7' },
	{ loc: `${SITE}/dictionary`, lastmod: '2026-06-20', changefreq: 'weekly', priority: '0.7' },
	{ loc: `${SITE}/settings`, lastmod: '2026-06-20', changefreq: 'monthly', priority: '0.3' },
	{ loc: `${SITE}/privacy`, lastmod: '2026-05-09', changefreq: 'yearly', priority: '0.3' }
];

// 용어 페이지는 frontmatter에서 자동 생성 — 용어가 늘어도 수동 동기화 불필요.
function termEntries(): Entry[] {
	return terms.map((t) => ({
		loc: `${SITE}/dictionary/${encodeURIComponent(t.slug)}`,
		lastmod: t.updated ?? FALLBACK_DATE,
		changefreq: 'monthly',
		priority: '0.6'
	}));
}

function renderUrl(e: Entry): string {
	return `  <url>
    <loc>${e.loc}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`;
}

export const GET: RequestHandler = () => {
	const entries = [...staticEntries, ...termEntries()];
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(renderUrl).join('\n')}
</urlset>
`;
	return new Response(body, {
		headers: { 'Content-Type': 'application/xml' }
	});
};
