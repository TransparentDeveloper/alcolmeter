import { Calculator } from '../abstract';
import { Fermentation, type Feed } from '../fermentation';
import { Nuruk, Rice, Water } from '../../model/ingredient';
import { RiceForm } from '../../model/rice-form';

const MILSUL_RICE_FRACTION = 0.15; // 밑술 쌀 비율(고정) — 효모 배양 최소 단위. 캘리브레이션 전 임시값.

/** 막걸리 빚기 입력. 물·누룩은 쌀 대비 비율로 받는다. */
export interface MakgeolliInput {
	rice: Rice; // 총 쌀
	baseForm: RiceForm; // 밑술 쌀 형태
	waterRatio: number; // 급수율 (물/쌀)
	nurukRatio: number; // 누룩/쌀
	stageCount: number;
}

/** 한 담금 단계 구성(계획·표시). 발효엔 부피·당만 추출돼 넘어간다. */
export interface StageComposition {
	rice: Rice;
	water: Water;
	nuruk: Nuruk;
	form: RiceForm;
}

export interface MakgeolliOutcome {
	abvPercent: number;
	volumeLiters: number;
	residualSugarLiters: number;
	optimalWaterRatio: number; // 잔당 없이 도수를 최대로 내는 급수율(추천)
	stages: StageComposition[];
}

/**
 * 막걸리 계산기 — 막걸리 유도(분배)로 단계 계획을 짜고, 공용 발효(`Fermentation`)에 넘겨 도수를 낸다.
 * 발효 물리는 `Fermentation`이 전담하고, 여기선 막걸리 고유의 **분배 규칙**만 다룬다.
 * (분배 규칙·식 상세는 README "막걸리 계산 과정" 참고.)
 */
export class MakgeolliCalculator extends Calculator<MakgeolliInput, MakgeolliOutcome> {
	private readonly fermentation = new Fermentation();

	// 쌀 분배: 밑술 고정 비율 + 나머지를 덧술에 점증(1:2:…:N−1) 분배.
	private distributeRiceGrams(totalRiceGrams: number, stageCount: number): number[] {
		if (stageCount === 1) return [totalRiceGrams];
		const milsulGrams = totalRiceGrams * MILSUL_RICE_FRACTION;
		const deotsulGrams = totalRiceGrams - milsulGrams;
		const deotsulCount = stageCount - 1;
		const weightSum = (deotsulCount * (deotsulCount + 1)) / 2;
		const deotsul = Array.from(
			{ length: deotsulCount },
			(_, k) => (deotsulGrams * (k + 1)) / weightSum
		);
		return [milsulGrams, ...deotsul];
	}

	// 단계별 쌀 형태: 밑술·중간 덧술은 기준 형태, 마지막 덧술은 고두밥(되직). 1단이면 기준 형태 그대로.
	private assignForms(baseForm: RiceForm, stageCount: number): RiceForm[] {
		if (stageCount === 1) return [baseForm];
		const godubap = RiceForm.of('GODUBAP');
		return Array.from({ length: stageCount }, (_, i) =>
			i === stageCount - 1 ? godubap : baseForm
		);
	}

	// 물 분배: 총 물을 단계별 (쌀 × 형태급수비율)에 비례 분배 — 형태가 '얼마나 묽게'의 상대 가중.
	// 가중 합이 0이면(전부 고두밥 등) 쌀량 비례로 폴백.
	private distributeWaterGrams(
		totalWaterGrams: number,
		riceGramsByStage: number[],
		formByStage: RiceForm[]
	): number[] {
		const weights = riceGramsByStage.map((grams, i) => grams * formByStage[i]!.waterRatio);
		const weightSum = weights.reduce((sum, w) => sum + w, 0);
		const basis = weightSum > 0 ? weights : riceGramsByStage;
		const basisSum = basis.reduce((sum, w) => sum + w, 0);
		return basis.map((w) => (basisSum > 0 ? (totalWaterGrams * w) / basisSum : 0));
	}

	private plan(input: MakgeolliInput): StageComposition[] {
		const { rice, baseForm, waterRatio, nurukRatio, stageCount } = input;
		const totalRiceGrams = rice.amount;
		const totalWaterGrams = totalRiceGrams * waterRatio;
		const totalNurukGrams = totalRiceGrams * nurukRatio;

		const riceGramsByStage = this.distributeRiceGrams(totalRiceGrams, stageCount);
		const formByStage = this.assignForms(baseForm, stageCount);
		const waterGramsByStage = this.distributeWaterGrams(
			totalWaterGrams,
			riceGramsByStage,
			formByStage
		);

		return riceGramsByStage.map((riceGrams, i) => ({
			rice: Rice.ofGrams(riceGrams),
			water: Water.ofGrams(waterGramsByStage[i]!),
			nuruk: Nuruk.ofGrams(i === 0 ? totalNurukGrams : 0), // 누룩 전량 밑술
			form: formByStage[i]!
		}));
	}

	// 잔당 없이 도수가 내성에 닿는 급수율: 최적 총물 = 총당/내성 − 쌀부피.
	private optimalWaterRatio(rice: Rice): number {
		const idealVolumeLiters = this.fermentation.ceilingVolume(rice.potentialEthanolLiters);
		const waterLiters = Math.max(0, idealVolumeLiters - rice.volumeLiters);
		return rice.amount > 0 ? (waterLiters * 1000) / rice.amount : 0;
	}

	calculate(input: MakgeolliInput): MakgeolliOutcome {
		if (!Number.isInteger(input.stageCount) || input.stageCount < 1) {
			throw new RangeError(`stageCount must be a positive integer, got ${input.stageCount}`);
		}

		const stages = this.plan(input);
		const feeds: Feed[] = stages.map((stage) => ({
			addedVolume: stage.rice.volumeLiters + stage.water.volumeLiters,
			addedSugar: stage.rice.potentialEthanolLiters
		}));
		const outcome = this.fermentation.calculate(feeds);

		return {
			abvPercent: outcome.abvPercent,
			volumeLiters: outcome.volumeLiters,
			residualSugarLiters: outcome.residualSugarLiters,
			optimalWaterRatio: this.optimalWaterRatio(input.rice),
			stages
		};
	}
}
