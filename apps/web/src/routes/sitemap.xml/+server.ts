import { Supabase } from '$shared/supabase/api';
import { WikiAPI } from '$entities/wiki/api';
import { PostAPI } from '$entities/post/api';
import type { RequestHandler } from './$types';

export const prerender = false;

const SITE = 'https://alcolmeter.kr';

type Entry = { loc: string; lastmod: string; changefreq: string; priority: string };

// 고정 페이지. 새 정적 페이지가 생기면 여기에 추가한다.
const staticEntries: Entry[] = [
	{ loc: `${SITE}/`, lastmod: '2026-06-20', changefreq: 'daily', priority: '1.0' },
	{ loc: `${SITE}/calculate-makgeolli`, lastmod: '2026-07-22', changefreq: 'monthly', priority: '0.3' },
	{ loc: `${SITE}/calculate-cider`, lastmod: '2026-07-25', changefreq: 'monthly', priority: '0.3' },
	{ loc: `${SITE}/community`, lastmod: '2026-07-15', changefreq: 'weekly', priority: '0.7' },
	{ loc: `${SITE}/faq`, lastmod: '2026-06-20', changefreq: 'daily', priority: '0.7' },
	{ loc: `${SITE}/wiki`, lastmod: '2026-07-19', changefreq: 'weekly', priority: '0.7' },
	{ loc: `${SITE}/settings`, lastmod: '2026-06-20', changefreq: 'monthly', priority: '0.3' },
	{ loc: `${SITE}/privacy`, lastmod: '2026-07-26', changefreq: 'yearly', priority: '0.3' },
	{ loc: `${SITE}/terms`, lastmod: '2026-08-01', changefreq: 'yearly', priority: '0.3' },
	{ loc: `${SITE}/policy`, lastmod: '2026-08-01', changefreq: 'yearly', priority: '0.3' }
];

function renderUrl(e: Entry): string {
	return `  <url>
    <loc>${e.loc}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`;
}

export const GET: RequestHandler = async ({ cookies }) => {
	const client = Supabase.getServerClient(cookies);
	const [terms, posts] = await Promise.all([WikiAPI.list(client), PostAPI.listIndex(client)]);
	const termEntries: Entry[] = terms.map((t) => ({
		loc: `${SITE}/wiki/${encodeURIComponent(t.slug)}`,
		lastmod: t.updatedAt.slice(0, 10),
		changefreq: 'monthly',
		priority: '0.6'
	}));
	const postEntries: Entry[] = posts.map((p) => ({
		loc: `${SITE}/community/${p.id}`,
		lastmod: p.updatedAt.slice(0, 10),
		changefreq: 'monthly',
		priority: '0.6'
	}));
	const entries = [...staticEntries, ...termEntries, ...postEntries];
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(renderUrl).join('\n')}
</urlset>
`;
	return new Response(body, {
		headers: { 'Content-Type': 'application/xml' }
	});
};
