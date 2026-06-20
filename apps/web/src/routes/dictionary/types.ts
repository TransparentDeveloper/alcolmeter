import type { TermMeta } from '$lib/dictionary/terms';

export type { TermMeta };

export type CategoryGroup = {
	category: string;
	items: TermMeta[];
};
