import type { CiderResult } from '@alcolmeter/domain-v2';

// 유의미한 잔당 임계(g/L). 이 이하는 드라이로 본다. 캘리브레이션 전 임시값.
const RESIDUAL_EPSILON_G_PER_L = 2;

interface BrewData {
	alcoholPercent: number;
	volumeLiters: number;
	residualSugarGrams: number;
}

// 사이다 계산 결과 뷰모델. domain-v2 결과를 감싸 화면용 수치·판정으로 제공한다(라벨 없음).
class CiderBrew {
	private data: BrewData;

	constructor(data: BrewData) {
		this.data = data;
	}

	get alcoholPercent(): number {
		return this.data.alcoholPercent;
	}

	get volumeLiters(): number {
		return this.data.volumeLiters;
	}

	// 리터당 잔당(g/L). 액이 없으면 0.
	get residualSugarPerLiter(): number {
		return this.data.volumeLiters > 0 ? this.data.residualSugarGrams / this.data.volumeLiters : 0;
	}

	// 가당이 효모 내성을 넘겨 발효가 멈추고 유의미한 잔당이 남았는가.
	get fermentationStopped(): boolean {
		return this.residualSugarPerLiter > RESIDUAL_EPSILON_G_PER_L;
	}

	// domain-v2 계산 결과 → 화면용 뷰모델.
	static fromOutcome(result: CiderResult): CiderBrew {
		return new CiderBrew({
			alcoholPercent: result.abvPercent,
			volumeLiters: result.volumeLiters,
			residualSugarGrams: result.residualSugarGrams
		});
	}
}

export { CiderBrew };
export type { BrewData };
