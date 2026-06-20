import { error } from '@sveltejs/kit';
import { getTerm, terms } from '$lib/dictionary/terms';
import type { EntryGenerator, PageLoad } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => terms.map((t) => ({ slug: t.slug }));

// 본문 컴포넌트는 지연 로드 (해당 용어 번들만 가져온다).
const componentModules = import.meta.glob('/src/content/dictionary/*.md');

export const load: PageLoad = async ({ params }) => {
	const meta = getTerm(params.slug);
	const resolve = componentModules[`/src/content/dictionary/${params.slug}.md`];

	if (!meta || !resolve) {
		throw error(404, `용어 '${params.slug}'를 찾을 수 없습니다.`);
	}

	const mod = (await resolve()) as { default: import('svelte').Component };

	const related = (meta.related ?? [])
		.map((slug) => getTerm(slug))
		.filter((t): t is NonNullable<typeof t> => Boolean(t))
		.sort((a, b) => a.title.localeCompare(b.title, 'ko'));

	return { component: mod.default, meta, related };
};
