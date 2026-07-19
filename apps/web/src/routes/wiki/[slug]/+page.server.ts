import { error } from '@sveltejs/kit';
import { Supabase } from '$shared/supabase/api';
import { WikiAPI } from '$entities/wiki/api';
import { renderWiki } from '$shared/lib/wiki-render';
import type { PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = async ({ params, cookies }) => {
	const client = Supabase.getServerClient(cookies);
	const term = await WikiAPI.getBySlug(client, params.slug);
	if (!term) throw error(404, `용어 '${params.slug}'를 찾을 수 없습니다.`);
	const slugs = await WikiAPI.existingSlugs(client);
	const relatedTerms = (await WikiAPI.list(client))
		.filter((t) => term.related.includes(t.slug))
		.sort((a, b) => a.title.localeCompare(b.title, 'ko'))
		.map((t) => ({ slug: t.slug, title: t.title }));
	return { term: term.toData(), bodyHtml: renderWiki(term.body, slugs), related: relatedTerms };
};
