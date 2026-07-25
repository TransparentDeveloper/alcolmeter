// 스크롤 위치에 따라 현재 보고 있는 섹션 id를 추적한다(사이드 목차 강조용).
// 뷰포트 상단 근처의 기준선을 지난(=이미 읽기 시작한) 섹션 중 문서 순서상 마지막을 활성으로 본다.
// 말미의 짧은 섹션은 기준선까지 밀려 올라오지 못할 수 있어, 문서 끝에 닿으면 마지막 섹션을 활성화한다.
class PrivacyDocumentState {
	activeId = $state<string>('');

	attach(root: HTMLElement): () => void {
		const els = Array.from(root.querySelectorAll<HTMLElement>('section[id]'));
		if (els.length === 0) return () => {};

		let ticking = false;

		const compute = () => {
			ticking = false;
			const line = window.innerHeight * 0.25;

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

export { PrivacyDocumentState };
