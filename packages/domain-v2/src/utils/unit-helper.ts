import type { UnitType } from '../types';

/** 입력 단위를 그램으로 정규화한다(액체는 밀도 1 가정). */
export function toGrams(amount: number, unit: UnitType): number {
	switch (unit) {
		case 'g':
			return amount;
		case 'kg':
			return amount * 1000;
		case 'ml':
			return amount;
		case 'L':
			return amount * 1000;
		default:
			throw new RangeError(`지원하지 않는 단위: ${unit}`);
	}
}
