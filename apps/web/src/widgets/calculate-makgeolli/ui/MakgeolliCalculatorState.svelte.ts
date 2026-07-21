import { MakgeolliCalcService } from '$features/calculate-makgeolli/service';
import type { RiceFormType, BrewTabType, MakgeolliBrew } from '$entities/makgeolli/model';

// 입력 상한. UI max 속성은 타이핑·붙여넣기로 뚫리므로 여기서 hard clamp 한다.
const INPUT_MAX = { rice: 999, water: 500, nuruk: 50 } as const;

// 담금 유형별 누룩 기본값(%). 탭 전환·기본 표시에 쓴다.
const NURUK_DEFAULT: Record<BrewTabType, number> = { DANYANG: 20, IYANG: 15, SAMYANG: 10 };

const clamp = (value: number, max: number): number =>
	Number.isFinite(value) ? Math.max(0, Math.min(value, max)) : value;

// 막걸리 계산기의 뷰 상태·연산. 이 위젯에 닫힌 지역 상태라 위젯 ui class로 둔다.
class MakgeolliCalculatorState {
	private _totalRice = $state(6);
	private _riceForm = $state<RiceFormType>('TTEOK');
	private _waterRatioPercent = $state(100);
	private _nurukRatio = $state(15);
	private _activeTab = $state<BrewTabType>('IYANG');

	private _brew = $derived.by(
		(): MakgeolliBrew =>
			MakgeolliCalcService.calculate({
				totalRice: Math.max(0, this._totalRice || 0),
				riceForm: this._riceForm,
				waterRatioPercent: Math.max(0, this._waterRatioPercent || 100),
				nurukRatio: Math.max(0, this._nurukRatio || NURUK_DEFAULT[this._activeTab]),
				brewTab: this._activeTab
			})
	);

	get totalRice(): number {
		return this._totalRice;
	}
	set totalRice(value: number) {
		this._totalRice = clamp(value, INPUT_MAX.rice);
	}

	get riceForm(): RiceFormType {
		return this._riceForm;
	}
	set riceForm(value: RiceFormType) {
		this._riceForm = value;
	}

	get waterRatioPercent(): number {
		return this._waterRatioPercent;
	}
	set waterRatioPercent(value: number) {
		this._waterRatioPercent = clamp(value, INPUT_MAX.water);
	}

	get nurukRatio(): number {
		return this._nurukRatio;
	}
	set nurukRatio(value: number) {
		this._nurukRatio = clamp(value, INPUT_MAX.nuruk);
	}

	get activeTab(): BrewTabType {
		return this._activeTab;
	}

	get showGodubap(): boolean {
		return this._activeTab === 'DANYANG';
	}

	get nurukDefault(): number {
		return NURUK_DEFAULT[this._activeTab];
	}

	get brew(): MakgeolliBrew {
		return this._brew;
	}

	switchTab(tab: BrewTabType): void {
		this._activeTab = tab;
		this._nurukRatio = NURUK_DEFAULT[tab];
		// 고두밥은 단양주에서만 노출하므로, 다른 유형으로 옮기면 기본 형태로 되돌린다.
		if (tab !== 'DANYANG' && this._riceForm === 'GODUBAP') this._riceForm = 'TTEOK';
	}
}

export { MakgeolliCalculatorState, INPUT_MAX };
