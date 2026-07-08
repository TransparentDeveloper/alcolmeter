import { error } from '@sveltejs/kit';
import { getTerm, terms } from '$entities/dictionary/lib';
import { loadTermComponent } from '$entities/dictionary/api';
import type { EntryGenerator, PageLoad } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => terms.map((t) => ({ slug: t.slug }));

export const load: PageLoad = async ({ params }) => {
	const meta = getTerm(params.slug);
	const component = meta ? await loadTermComponent(params.slug) : null;

	if (!meta || !component) {
		throw error(404, `용어 '${params.slug}'를 찾을 수 없습니다.`);
	}

	const related = (meta.related ?? [])
		.map((slug) => getTerm(slug))
		.filter((t): t is NonNullable<typeof t> => Boolean(t))
		.sort((a, b) => a.title.localeCompare(b.title, 'ko'));

	return { component, meta, related };
};
