import type { WikiTermData } from '$entities/wiki/model';

// 알콜위키 랜딩 뷰 상태: 검색어와 그로부터 파생되는 결과만 담는다.
// 검색 전(query 공백)에는 결과를 노출하지 않는다 — 초기 화면은 제목·소개·검색창뿐.
class WikiIndexState {
	query = $state('');
	#all: WikiTermData[];

	constructor(all: WikiTermData[]) {
		this.#all = all;
	}

	get hasQuery(): boolean {
		return this.query.trim().length > 0;
	}

	#results = $derived.by(() => {
		const q = this.query.trim().toLowerCase();
		if (!q) return [];
		return this.#all.filter(
			(t) => t.title.toLowerCase().includes(q) || t.summary.toLowerCase().includes(q)
		);
	});

	get results(): WikiTermData[] {
		return this.#results;
	}

	get isEmpty(): boolean {
		return this.hasQuery && this.results.length === 0;
	}
}

export { WikiIndexState };
