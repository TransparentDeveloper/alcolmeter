import type { Component } from 'svelte';

// 본문 컴포넌트는 지연 로드한다 (해당 용어 번들만 가져온다).
const componentModules = import.meta.glob('/src/content/dictionary/*.md');

/** slug의 mdsvex 본문 컴포넌트를 지연 로드한다. 없으면 null. */
export async function loadTermComponent(slug: string): Promise<Component | null> {
	const resolve = componentModules[`/src/content/dictionary/${slug}.md`];
	if (!resolve) return null;
	const mod = (await resolve()) as { default: Component };
	return mod.default;
}
