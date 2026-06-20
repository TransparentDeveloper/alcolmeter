import type { TermMeta, CategoryGroup } from './types';

function groupByCategory(items: TermMeta[]): CategoryGroup[] {
	const groups: CategoryGroup[] = [];
	for (const term of items) {
		let group = groups.find((g) => g.category === term.category);
		if (!group) {
			group = { category: term.category, items: [] };
			groups.push(group);
		}
		group.items.push(term);
	}
	return groups;
}

export function useDictionary(allTerms: TermMeta[]) {
	let query = $state('');

	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		if (!q) return allTerms;
		return allTerms.filter(
			(t) => t.title.toLowerCase().includes(q) || t.summary.toLowerCase().includes(q)
		);
	});

	const groups = $derived(groupByCategory(filtered));

	return {
		get query() {
			return query;
		},
		set query(v: string) {
			query = v;
		},
		get groups() {
			return groups;
		},
		get count() {
			return filtered.length;
		},
		get total() {
			return allTerms.length;
		}
	};
}
