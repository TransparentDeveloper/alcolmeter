import type { Apple, Sugar } from '../../model/ingredient';

import { Calculator } from '../abstract';
import {
	Fermentation,
	type Feed,
	type FermentationOutcome,
	type FermentationParams
} from '../fermentation';

// 사이다(사과 발효) 발효 상수 — 캘리브레이션 전 임시값.
// 단발 발효라 삼투압 soft-lock이 없다: 농도 한계를 무제한으로 둬 내성까지 드라이하게 발효된다.
const CIDER_FERMENTATION: FermentationParams = {
	maxConcentration: Number.POSITIVE_INFINITY, // 농도 한계 없음(단발 발효) → 사과 부피>0 전제
	maxAbv: 0.12, // 사과 발효 효모 내성
	lossRatio: 0 // 농도 한계가 없어 사용되지 않음
};

/** 사이다 빚기 입력. */
export interface CiderInput {
	apple: Apple;
	sugar: Sugar; // 가당 없으면 0g
}

/**
 * 사이다 계산기 — 사과즙과 가당을 단일 투입(`Feed`)으로 묶어 공용 발효(`Fermentation`)에 넘긴다.
 * 담금 단계가 없는 단발 발효라 막걸리 같은 분배(유도) 로직이 없다.
 */
export class CiderCalculator extends Calculator<CiderInput, FermentationOutcome> {
	private readonly fermentation = new Fermentation(CIDER_FERMENTATION);

	calculate({ apple, sugar }: CiderInput): FermentationOutcome {
		const feed: Feed = {
			addedVolume: apple.juiceVolumeLiters + sugar.volumeLiters,
			addedSugar: apple.potentialEthanolLiters + sugar.potentialEthanolLiters
		};
		return this.fermentation.calculate([feed]);
	}
}
