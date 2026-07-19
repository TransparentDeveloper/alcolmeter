import { error } from '@sveltejs/kit';
import { Supabase } from '$shared/supabase/api';
import { WikiAPI } from '$entities/wiki/api';
import { renderWiki } from '$shared/lib/wiki-render';
import type { PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = async ({ params, cookies }) => {
	const revId = Number(params.revId);
	if (!Number.isInteger(revId)) throw error(404, '이력을 찾을 수 없습니다.');

	const client = Supabase.getServerClient(cookies);
	const rev = await WikiAPI.getRevision(client, revId);
	if (!rev) throw error(404, '이력을 찾을 수 없습니다.');
	const slugs = await WikiAPI.existingSlugs(client);
	return { slug: params.slug, revision: rev.toData(), bodyHtml: renderWiki(rev.body, slugs) };
};
