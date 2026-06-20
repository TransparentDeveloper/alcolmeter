import { LiquorController, type MakgeolliRequest } from '@alcolmeter/domain-v2';
import { RICE_FORM_LABELS, type RiceForm, type BrewResult } from '$lib/types';
import type { BrewTab, BrewMeta, StageNames, NurukHints } from './types';

const NURUK_CONFIG: Record<BrewTab, { default: number; min: number; max: number }> = {
	DANYANG: { default: 20, min: 20, max: 25 },
	IYANG:   { default: 15, min: 15, max: 20 },
	SAMYANG: { default: 10, min: 10, max: 15 }
};

const TO_DOMAIN_RICE_FORM = {
	godubap: 'GODUBAP', tteok: 'TTEOK', beombuk: 'BEOMBUK', juk: 'JUK'
} as const satisfies Record<RiceForm, MakgeolliRequest['riceForm']>;

const FROM_DOMAIN_RICE_FORM = {
	GODUBAP: 'godubap', TTEOK: 'tteok', BEOMBUK: 'beombuk', JUK: 'juk'
} as const satisfies Record<MakgeolliRequest['riceForm'], RiceForm>;

const BREW_COUNT = { DANYANG: 1, IYANG: 2, SAMYANG: 3 } as const satisfies Record<BrewTab, 1 | 2 | 3>;

const controller = new LiquorController();

export function useMakgeolli(brewMeta: BrewMeta, stageNames: StageNames, nurukHints: NurukHints) {
	let totalRice = $state(6);
	let riceForm: RiceForm = $state('tteok');
	let waterRatioPercent = $state(100);
	let nurukRatio = $state(15);
	let activeTab = $state<BrewTab>('IYANG');

	let nurukHint = $derived(nurukHints[activeTab]);
	let nurukDefault = $derived(NURUK_CONFIG[activeTab].default);
	let showGodubap = $derived(activeTab === 'DANYANG');

	let result = $derived.by((): BrewResult => {
		const rice = Math.max(0, totalRice || 0);
		const water = Math.max(0, waterRatioPercent || 100) / 100;
		const nuruk = Math.max(0, nurukRatio || NURUK_CONFIG[activeTab].default);
		const stageCount = BREW_COUNT[activeTab];

		const outcome = controller.makgeolli({
			totalRice: { kind: 'RICE', amount: rice, unit: 'kg' },
			riceForm: TO_DOMAIN_RICE_FORM[riceForm],
			waterRatio: water,
			nurukRatio: nuruk / 100,
			stageCount
		});

		const names = stageNames[stageCount];
		const gramsOf = (stage: (typeof outcome.stages)[number], kind: 'RICE' | 'WATER' | 'NURUK') =>
			stage.ingredients.find((item) => item.kind === kind)?.amount ?? 0;

		const stages = outcome.stages.map((s, i) => ({
			name: names[i],
			riceFormLabel: RICE_FORM_LABELS[FROM_DOMAIN_RICE_FORM[s.riceForm]],
			rice: gramsOf(s, 'RICE') / 1000,
			water: gramsOf(s, 'WATER') / 1000,
			nuruk: gramsOf(s, 'NURUK') / 1000
		}));

		return {
			...brewMeta[activeTab],
			stages,
			totalRice: stages.reduce((sum, s) => sum + s.rice, 0),
			totalWater: stages.reduce((sum, s) => sum + s.water, 0),
			totalNuruk: stages.reduce((sum, s) => sum + s.nuruk, 0),
			estimates: {
				volumeLiters: outcome.volumeLiters,
				alcoholPercent: outcome.abvPercent
			}
		};
	});

	function switchTab(tabId: BrewTab) {
		activeTab = tabId;
		nurukRatio = NURUK_CONFIG[tabId].default;
		if (tabId !== 'DANYANG' && riceForm === 'godubap') {
			riceForm = 'tteok';
		}
	}

	return {
		get totalRice() { return totalRice; },
		set totalRice(v: number) { totalRice = v; },
		get riceForm() { return riceForm; },
		set riceForm(v: RiceForm) { riceForm = v; },
		get waterRatioPercent() { return waterRatioPercent; },
		set waterRatioPercent(v: number) { waterRatioPercent = v; },
		get nurukRatio() { return nurukRatio; },
		set nurukRatio(v: number) { nurukRatio = v; },
		get activeTab() { return activeTab; },
		get nurukHint() { return nurukHint; },
		get nurukDefault() { return nurukDefault; },
		get showGodubap() { return showGodubap; },
		get result() { return result; },
		switchTab
	};
}
