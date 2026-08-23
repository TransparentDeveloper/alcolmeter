<script lang="ts">
	// 홈으로 가는 이동을 진입 지점의 홈 항목으로 되감는다. 홈을 새 항목으로 쌓지 않으니
	// 홈에서 뒤로 가면 사이트를 벗어난다. 이동을 한자리에서 가로채므로 링크·goto 호출부는
	// 아무것도 몰라도 되고, 히스토리는 문서마다 하나뿐이라 루트 레이아웃에서만 호출한다.
	// 그리는 것은 없다.
	import { afterNavigate, beforeNavigate } from '$app/navigation';

	const HOME_PATH = '/';
	// SvelteKit이 히스토리 항목마다 심어 두는 단조 증가 인덱스의 키. push는 +1,
	// replaceState는 그대로, 뒤로가기는 그 항목의 값으로 복원되므로 이 값의 차이가
	// 진입 지점까지의 정확한 칸 수다 (이동을 직접 세면 replaceState를 놓친다).
	const HISTORY_INDEX_KEY = 'sveltekit:history';

	// 진입 시점의 히스토리 자리와 그곳이 홈이었는지. 새로고침하면 그 자리가 새 진입 지점이
	// 되고 되감기는 쉰다. 화면에 쓰이지 않으므로 룬으로 두지 않는다.
	let entryIndex: number | null = null;
	let entryIsHome = false;
	// 우리가 일으킨 되감기인지. 사용자가 직접 누른 뒤로가기와 구분해야 한다.
	let rewinding = false;

	// 아직 SvelteKit이 심기 전이거나 키가 바뀌었으면 null. 그때는 되감지 않는다.
	function readIndex(): number | null {
		const state: unknown = history.state;
		if (!state || typeof state !== 'object') return null;

		const index = (state as Record<string, unknown>)[HISTORY_INDEX_KEY];
		return typeof index === 'number' ? index : null;
	}

	afterNavigate((navigation) => {
		if (navigation.type === 'enter') {
			entryIndex = readIndex();
			entryIsHome = navigation.to?.url.pathname === HOME_PATH;
			return;
		}

		if (!rewinding) return;
		rewinding = false;

		// 되감아 도착한 홈은 새로 여는 화면처럼 최상단에서 시작한다. popstate라 SvelteKit이
		// 옛 스크롤 위치를 복원해 두는데, 그 복원이 끝난 뒤인 여기서 덮어쓴다.
		if (navigation.type === 'popstate') scrollTo(0, 0);
	});

	beforeNavigate((navigation) => {
		// 뒤로가기(popstate)·이탈(leave)·폼 전송은 그대로 두고, 홈으로 새로 가는 이동만 되감는다.
		if (navigation.type !== 'link' && navigation.type !== 'goto') return;

		// 쿼리·해시가 붙은 홈은 그 주소 자체가 목적이므로 되감으면 잃는다.
		const target = navigation.to?.url;
		if (!target || target.pathname !== HOME_PATH || target.search || target.hash) return;

		// 진입 지점이 홈이 아니면 되돌아갈 홈 항목이 애초에 없다.
		if (!entryIsHome || entryIndex === null) return;

		const current = readIndex();
		if (current === null) return;

		const steps = current - entryIndex;
		if (steps < 1) return;

		navigation.cancel();
		rewinding = true;
		history.go(-steps);
	});
</script>
