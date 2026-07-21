import { LiquorController } from '@alcolmeter/domain-v2';
import type { MakgeolliRequest, RiceFormType } from '@alcolmeter/domain-v2';
import { MakgeolliBrew } from '$entities/makgeolli/model';
import type { BrewTabType } from '$entities/makgeolli/model';

// 계산기 뷰에서 넘어오는 입력. 물·누룩은 %로 받아 여기서 비율로 환산한다.
interface CalculateInput {
	totalRice: number; // kg
	riceForm: RiceFormType;
	waterRatioPercent: number;
	nurukRatio: number; // %
	brewTab: BrewTabType;
}

// 담금 유형별 담금 횟수(단계 수).
const STAGE_COUNT: Record<BrewTabType, number> = { DANYANG: 1, IYANG: 2, SAMYANG: 3 };

const controller = new LiquorController();

// 막걸리 배합 계산 액션. 입력을 도메인 요청으로 조립·호출하고 뷰모델로 되돌린다.
class MakgeolliCalcService {
	static calculate(input: CalculateInput): MakgeolliBrew {
		const request: MakgeolliRequest = {
			totalRice: { kind: 'RICE', amount: input.totalRice, unit: 'kg' },
			riceForm: input.riceForm,
			waterRatio: input.waterRatioPercent / 100,
			nurukRatio: input.nurukRatio / 100,
			stageCount: STAGE_COUNT[input.brewTab]
		};
		return MakgeolliBrew.fromOutcome(controller.makgeolli(request));
	}
}

export { MakgeolliCalcService };
export type { CalculateInput };
