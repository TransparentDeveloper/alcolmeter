/**
 * 테마 단일 소스.
 *
 * 색상 토큰 자체는 @alcolmeter/design-system 의 tokens.css 가 정의한다:
 *   data-theme 미설정 → :root(라이트) + prefers-color-scheme(다크 자동)
 *   data-theme="light" → 라이트 강제
 *   data-theme="dark"  → 다크 강제
 *
 * 이 모듈은 사용자가 고른 모드를 localStorage 에 저장하고 <html data-theme> 에 반영한다.
 * 첫 페인트 전 적용(FOUC 방지)은 app.html 의 인라인 스크립트가 담당하며,
 * 저장 키만 이 모듈과 공유한다 (THEME_STORAGE_KEY).
 */
export type ThemeMode = 'system' | 'light' | 'dark';

export const THEME_STORAGE_KEY = 'alcolmeter-theme';

const isThemeMode = (v: unknown): v is ThemeMode =>
	v === 'system' || v === 'light' || v === 'dark';

/** 저장된 테마 모드를 읽는다. 없거나 비정상 값이면 'system'. SSR 안전. */
export function getStoredTheme(): ThemeMode {
	if (typeof localStorage === 'undefined') return 'system';
	const stored = localStorage.getItem(THEME_STORAGE_KEY);
	return isThemeMode(stored) ? stored : 'system';
}

/** 테마 모드를 저장하고 <html data-theme> 에 즉시 반영한다. */
export function setTheme(mode: ThemeMode): void {
	if (typeof document !== 'undefined') {
		if (mode === 'system') {
			delete document.documentElement.dataset.theme;
		} else {
			document.documentElement.dataset.theme = mode;
		}
	}
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem(THEME_STORAGE_KEY, mode);
	}
}
