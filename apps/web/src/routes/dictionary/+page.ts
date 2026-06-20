import { terms } from '$lib/dictionary/terms';
import type { PageLoad } from './$types';

export const prerender = true;

export const load: PageLoad = () => ({ terms });
