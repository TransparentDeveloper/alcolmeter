import type { ThemeMode } from '$entities/theme/model';
import { getStoredTheme, setTheme } from '$entities/theme/lib';

/** 테마 설정의 뷰 상태·동작: 현재 선택 모드와 저장 동기화·변경. */
export class ThemeSetting {
	current = $state<ThemeMode>('system');

	/** 클라이언트 마운트 후 저장된 값으로 선택 상태를 맞춘다. */
	sync() {
		this.current = getStoredTheme();
	}

	select(mode: ThemeMode) {
		this.current = mode;
		setTheme(mode);
	}
}
