import type { BrewResult } from '$lib/types';

export type BrewTab = 'DANYANG' | 'IYANG' | 'SAMYANG';
export type BrewMeta = Record<BrewTab, { type: BrewResult['type']; label: string }>;
export type StageNames = Record<1 | 2 | 3, string[]>;
export type NurukHints = Record<BrewTab, string>;
