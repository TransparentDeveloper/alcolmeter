import type { TermMeta, CategoryGroup } from '$entities/dictionary/model';
import { termsByCategory } from '$entities/dictionary/lib';

/** 용어 인덱스의 뷰 상태·연산: 검색어와 그로부터 파생되는 필터·그룹·개수. */
export class DictionaryView {
	query = $state('');
	#all: TermMeta[];
	#filtered = $derived.by(() => {
		const q = this.query.trim().toLowerCase();
		if (!q) return this.#all;
		return this.#all.filter(
			(t) => t.title.toLowerCase().includes(q) || t.summary.toLowerCase().includes(q)
		);
	});

	constructor(all: TermMeta[]) {
		this.#all = all;
	}

	get groups(): CategoryGroup[] {
		return termsByCategory(this.#filtered);
	}

	get count(): number {
		return this.#filtered.length;
	}

	get total(): number {
		return this.#all.length;
	}
}
