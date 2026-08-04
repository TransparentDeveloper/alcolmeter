// 스크롤 위치에 따라 현재 보고 있는 섹션 id를 추적한다(사이드 목차 강조용).
// 뷰포트 상단 근처의 기준선을 지난(=이미 읽기 시작한) 섹션 중 문서 순서상 마지막을 활성으로 본다.
// 말미의 짧은 섹션은 기준선까지 밀려 올라오지 못할 수 있어, 문서 끝에 닿으면 마지막 섹션을 활성화한다.
//
// 기준선을 화면 비율이 아니라 상한 있는 고정값으로 두는 이유는, 기준선이 아래로 내려갈수록
// "그보다 짧은 섹션"이 통째로 건너뛰어지기 때문이다. 섹션 하나가 기준선을 지나는 순간 다음 섹션도
// 함께 지나버리면 그 섹션은 목차에서 영영 강조되지 않고, 목차 항목을 눌러 이동해도 다음 항목이
// 강조된다. 세로로 긴 화면일수록 심해져서 비율(vh)만으로는 막을 수 없다.
const LINE_MAX = 120;

class LegalDocumentState {
	activeId = $state<string>('');

	attach(root: HTMLElement): () => void {
		const els = Array.from(root.querySelectorAll<HTMLElement>('section[id]'));
		if (els.length === 0) return () => {};

		let ticking = false;

		const compute = () => {
			ticking = false;
			const line = Math.min(window.innerHeight * 0.25, LINE_MAX);

			let current = els[0].id;
			for (const el of els) {
				if (el.getBoundingClientRect().top <= line) current = el.id;
				else break;
			}

			const atBottom =
				window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
			if (atBottom) current = els[els.length - 1].id;

			this.activeId = current;
		};

		const onScroll = () => {
			if (ticking) return;
			ticking = true;
			requestAnimationFrame(compute);
		};

		compute();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll, { passive: true });

		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
		};
	}
}

export { LegalDocumentState };
