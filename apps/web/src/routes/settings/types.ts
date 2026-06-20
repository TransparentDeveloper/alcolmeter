import type { ThemeMode } from '$lib/theme';

export type { ThemeMode };

/** 테마 선택 세그먼트 항목. 표시 텍스트는 +page.svelte 에서 주입한다. */
export type ThemeOption = {
	mode: ThemeMode;
	label: string;
	hint: string;
};
