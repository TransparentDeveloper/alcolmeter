import type { WikiTermData } from '$entities/wiki/model';

const FEATURED_COUNT = 8;

// 알콜위키 랜딩 뷰 상태: 검색어·활성 카테고리와 그로부터 파생되는 카테고리 목록·필터 결과·
// 기본 노출(최근 수정 상위 N개)을 담는다. WikiList.svelte가 인스턴스화한다.
class WikiIndexState {
	query = $state('');
	activeCategory = $state<string | null>(null);
	#all: WikiTermData[];

	constructor(all: WikiTermData[]) {
		this.#all = all;
	}

	get categories(): string[] {
		const seen = new Set<string>();
		for (const t of this.#all) {
			if (t.category) seen.add(t.category);
		}
		return [...seen].sort((a, b) => a.localeCompare(b, 'ko'));
	}

	get isFiltering(): boolean {
		return this.query.trim().length > 0 || this.activeCategory !== null;
	}

	#filtered = $derived.by(() => {
		const q = this.query.trim().toLowerCase();
		return this.#all.filter((t) => {
			if (this.activeCategory && t.category !== this.activeCategory) return false;
			if (!q) return true;
			return t.title.toLowerCase().includes(q) || t.summary.toLowerCase().includes(q);
		});
	});

	#featured = $derived.by(() =>
		[...this.#all].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, FEATURED_COUNT)
	);

	get displayed(): WikiTermData[] {
		return this.isFiltering ? this.#filtered : this.#featured;
	}

	get isEmpty(): boolean {
		return this.displayed.length === 0;
	}

	selectCategory(category: string): void {
		this.activeCategory = this.activeCategory === category ? null : category;
	}

	clearCategory(): void {
		this.activeCategory = null;
	}
}

export { WikiIndexState };
