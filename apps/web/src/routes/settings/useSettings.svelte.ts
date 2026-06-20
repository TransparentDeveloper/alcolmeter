import { getStoredTheme, setTheme } from '$lib/theme';
import type { ThemeMode } from './types';

export function useSettings() {
	let theme = $state<ThemeMode>('system');

	/** 클라이언트 마운트 후 저장된 값으로 선택 상태를 맞춘다. */
	function sync() {
		theme = getStoredTheme();
	}

	function select(mode: ThemeMode) {
		theme = mode;
		setTheme(mode);
	}

	return {
		get theme() {
			return theme;
		},
		sync,
		select
	};
}
