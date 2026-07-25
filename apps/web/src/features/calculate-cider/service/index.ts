import { LiquorController } from '@alcolmeter/domain-v2';
import type { CiderRequest } from '@alcolmeter/domain-v2';
import { CiderBrew } from '$entities/cider/model';
import type { AppleVarietyType } from '$entities/cider/model';

// 계산기 뷰에서 넘어오는 입력. 가당(g)은 0이면 무가당으로 처리한다.
interface CalculateInput {
	appleKg: number;
	variety: AppleVarietyType;
	sugarGrams: number;
}

const controller = new LiquorController();

// 사이다 계산 액션. 입력을 도메인 요청으로 조립·호출하고 뷰모델로 되돌린다.
class CiderCalcService {
	static calculate(input: CalculateInput): CiderBrew {
		const request: CiderRequest = {
			apple: { amount: input.appleKg, unit: 'kg', variety: input.variety },
			addedSugar:
				input.sugarGrams > 0
					? { kind: 'SUGAR', amount: input.sugarGrams, unit: 'g' }
					: undefined
		};
		return CiderBrew.fromOutcome(controller.cider(request));
	}
}

export { CiderCalcService };
export type { CalculateInput };
