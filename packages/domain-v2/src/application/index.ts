import type { IngredientAmount, MakgeolliRequest, MakgeolliResult, MakgeolliStage, CiderRequest, CiderResult } from '../types';

import { MakgeolliCalculator, type StageComposition } from '../calculator/makgeolli';
import { CiderCalculator } from '../calculator/cider';
import { Rice, Apple, Sugar } from '../model/ingredient';
import { RiceForm } from '../model/rice-form';
import { AppleVariety } from '../model/apple-variety';
import { toGrams } from '../utils/unit-helper';
import { ethanolLitersToSugarGrams } from '../utils/sugar-helper';

/**
 * 응용 서비스(Application Service) — 막걸리 빚기 use case.
 * 입력 DTO를 도메인 입력으로 옮기고, 막걸리 계산기 결과를 DTO로 되돌린다.
 * 연산은 계산기에 위임하고, 여기선 번역·조율만 한다.
 */
export class MakgeolliService {
	private readonly calculator = new MakgeolliCalculator();

	private toStageDto(stage: StageComposition): MakgeolliStage {
		const ingredients: IngredientAmount[] = [
			{ kind: 'RICE', amount: stage.rice.amount, unit: 'g' }
		];
		if (stage.water.amount > 0) {
			ingredients.push({ kind: 'WATER', amount: stage.water.amount, unit: 'g' });
		}
		if (stage.nuruk.amount > 0) {
			ingredients.push({ kind: 'NURUK', amount: stage.nuruk.amount, unit: 'g' });
		}
		return { ingredients, riceForm: stage.form.code };
	}

	brew(request: MakgeolliRequest): MakgeolliResult {
		const totalRiceGrams = toGrams(request.totalRice.amount, request.totalRice.unit);
		const outcome = this.calculator.calculate({
			rice: Rice.ofGrams(totalRiceGrams),
			baseForm: RiceForm.of(request.riceForm),
			waterRatio: request.waterRatio,
			nurukRatio: request.nurukRatio,
			stageCount: request.stageCount
		});
		return {
			abvPercent: outcome.abvPercent,
			volumeLiters: outcome.volumeLiters,
			optimalWaterRatio: outcome.optimalWaterRatio,
			stages: outcome.stages.map((stage) => this.toStageDto(stage))
		};
	}
}

/**
 * 응용 서비스 — 사이다 빚기 use case.
 * 입력 DTO를 도메인 재료로 옮기고, 사이다 계산기 결과를 DTO로 되돌린다.
 */
export class CiderService {
	private readonly calculator = new CiderCalculator();

	brew(request: CiderRequest): CiderResult {
		const appleGrams = toGrams(request.apple.amount, request.apple.unit);
		const sugarGrams = request.addedSugar
			? toGrams(request.addedSugar.amount, request.addedSugar.unit)
			: 0;
		const outcome = this.calculator.calculate({
			apple: Apple.of(appleGrams, AppleVariety.of(request.apple.variety)),
			sugar: Sugar.ofGrams(sugarGrams)
		});
		return {
			abvPercent: outcome.abvPercent,
			volumeLiters: outcome.volumeLiters,
			residualSugarGrams: ethanolLitersToSugarGrams(outcome.residualSugarLiters)
		};
	}
}
