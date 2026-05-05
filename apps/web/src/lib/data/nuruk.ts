import type { NurukType } from '$lib/types';

export const NURUK_TYPES: NurukType[] = [
	{
		id: 'songhak',
		name: '송학곡자',
		saccharificationPower: 300,
		riceRatio: 0.1
	}
];

/** MVP: 송학곡자 고정 */
export const DEFAULT_NURUK = NURUK_TYPES[0];
