import type { OnNavigate } from '@sveltejs/kit';

// covering: 커버가 화면을 덮는 중 · revealing: 커버가 걷히는 중 · idle: 커버 없음.
type PageTransitionPhaseType = 'idle' | 'covering' | 'revealing';

// 3박자 길이. 셋을 합쳐 총 1350ms. 커버의 CSS 애니메이션도 이 값을 쓰므로
// (styleVars) 타이밍 소스가 여기 하나다.
const COVER_MS = 350;
const HOLD_MS = 650;
const REVEAL_MS = 350;

/**
 * 라우트 전환 커버의 단계를 관리한다.
 * 커버가 화면을 덮은 뒤에야 내비게이션을 진행시켜, 페이지 교체가 항상
 * 중립 화면 뒤에서 일어나게 만든다 (1 → 중립 → 2).
 */
class PageTransitionState {
	private currentPhase = $state<PageTransitionPhaseType>('idle');
	// 1: 우 → 좌로 흐름(앞으로 가기) · -1: 좌 → 우로 흐름(뒤로 가기)
	private currentDirection = $state<1 | -1>(1);

	get phase(): PageTransitionPhaseType {
		return this.currentPhase;
	}

	/** 커버에 붙일 인라인 CSS 변수. 위 상수와 방향을 애니메이션에 그대로 넘긴다. */
	get styleVars(): string {
		return [
			`--ds-page-cover-in-duration:${COVER_MS}ms`,
			`--ds-page-cover-out-duration:${REVEAL_MS}ms`,
			`--ds-page-cover-direction:${this.currentDirection}`
		].join(';');
	}

	/**
	 * `onNavigate`에 그대로 넘긴다. 커버가 덮이면 resolve되어 SvelteKit이 DOM을
	 * 교체하고, 반환한 함수가 새 페이지 렌더 후 호출되어 커버를 걷는다.
	 */
	intercept = async (navigation: OnNavigate): Promise<(() => void) | void> => {
		if (!this.isAnimatable(navigation)) return;

		this.currentDirection = PageTransitionState.isReverse(navigation) ? -1 : 1;
		this.currentPhase = 'covering';
		await PageTransitionState.wait(COVER_MS + HOLD_MS);

		return () => {
			this.currentPhase = 'revealing';
			PageTransitionState.wait(REVEAL_MS).then(() => {
				// 전환 도중 다시 이동했다면 그 전환을 덮어쓰지 않는다.
				if (this.currentPhase === 'revealing') this.currentPhase = 'idle';
			});
		};
	};

	private isAnimatable(navigation: OnNavigate): boolean {
		// 동작 줄이기를 켠 사용자에게는 커버를 띄우지 않는다.
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
		// 해시·쿼리만 바뀌는 이동은 화면이 그대로라 전환이 군더더기가 된다.
		if (!navigation.to || navigation.to.url.pathname === navigation.from?.url.pathname) {
			return false;
		}
		// <html data-motion="off">로 전환만 끌 수 있다 (비교·디버깅용 스위치).
		return document.documentElement.dataset.motion !== 'off';
	}

	// 되돌아가는 결의 이동은 흐름을 뒤집는다: 히스토리 후퇴(뒤로가기·스와이프)와
	// 메인홈 진입(계층을 거슬러 올라가는 이동).
	private static isReverse(navigation: OnNavigate): boolean {
		if (navigation.type === 'popstate' && navigation.delta < 0) return true;
		return navigation.to?.url.pathname === '/';
	}

	private static wait(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
}

export { PageTransitionState };
export type { PageTransitionPhaseType };
