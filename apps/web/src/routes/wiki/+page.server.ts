import { Supabase } from '$shared/supabase/api';
import { WikiAPI } from '$entities/wiki/api';
import type { PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = async ({ cookies }) => {
	const client = Supabase.getServerClient(cookies);
	const terms = await WikiAPI.list(client);
	return { terms: terms.map((t) => t.toData()) };
};
