import { error } from '@sveltejs/kit';
import { Supabase } from '$shared/supabase/api';
import { WikiAPI } from '$entities/wiki/api';
import type { PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = async ({ params, cookies }) => {
	const client = Supabase.getServerClient(cookies);
	const term = await WikiAPI.getBySlug(client, params.slug);
	if (!term) throw error(404, `용어 '${params.slug}'를 찾을 수 없습니다.`);
	const history = await WikiAPI.getHistory(client, term.id);
	return { term: term.toData(), history: history.map((r) => r.toData()), authorId: term.author.id };
};
