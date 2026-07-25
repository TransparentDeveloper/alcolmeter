import { CiderCalcService } from '$features/calculate-cider/service';
import type { AppleVarietyType, CiderBrew } from '$entities/cider/model';

// 입력 상한. UI max 속성은 타이핑·붙여넣기로 뚫리므로 여기서 hard clamp 한다.
const INPUT_MAX = { apple: 999, sugar: 5000 } as const;

const clamp = (value: number, max: number): number =>
	Number.isFinite(value) ? Math.max(0, Math.min(value, max)) : value;

// 사이다 계산기의 뷰 상태·연산. 이 위젯에 닫힌 지역 상태라 위젯 ui class로 둔다.
class CiderCalculatorState {
	private _appleKg = $state(10);
	private _variety = $state<AppleVarietyType>('FUJI');
	private _sugarEnabled = $state(false);
	private _sugarGrams = $state(0);

	private _brew = $derived.by(
		(): CiderBrew =>
			CiderCalcService.calculate({
				appleKg: Math.max(0, this._appleKg || 0),
				variety: this._variety,
				sugarGrams: this._sugarEnabled ? Math.max(0, this._sugarGrams || 0) : 0
			})
	);

	get appleKg(): number {
		return this._appleKg;
	}
	set appleKg(value: number) {
		this._appleKg = clamp(value, INPUT_MAX.apple);
	}

	get variety(): AppleVarietyType {
		return this._variety;
	}
	set variety(value: AppleVarietyType) {
		this._variety = value;
	}

	get sugarEnabled(): boolean {
		return this._sugarEnabled;
	}
	set sugarEnabled(value: boolean) {
		this._sugarEnabled = value;
	}

	get sugarGrams(): number {
		return this._sugarGrams;
	}
	set sugarGrams(value: number) {
		this._sugarGrams = clamp(value, INPUT_MAX.sugar);
	}

	get brew(): CiderBrew {
		return this._brew;
	}
}

export { CiderCalculatorState, INPUT_MAX };
