import type { FermentationRequest, FermentationResult, IngredientAmount } from '../types';

import { Nuruk, Rice, Water } from '../model/ingredient';
import { FermentationCalculator, type StageMaterials } from '../calculator/fermentation';
import { toGrams } from '../utils/unit-helper';

/**
 * 응용 서비스(Application Service) 계층 — 발효주 빚기 use case.
 * 입력 DTO를 도메인 재료로 옮기고, 발효 계산기 결과를 DTO로 되돌린다.
 */
export class FermentationService {
	private readonly calculator = new FermentationCalculator();

	private toStageIngredients(stage: StageMaterials): IngredientAmount[] {
		const items: IngredientAmount[] = [{ kind: 'RICE', amount: stage.rice.amount, unit: 'g' }];
		if (stage.water && stage.water.amount > 0) {
			items.push({ kind: 'WATER', amount: stage.water.amount, unit: 'g' });
		}
		if (stage.nuruk && stage.nuruk.amount > 0) {
			items.push({ kind: 'NURUK', amount: stage.nuruk.amount, unit: 'g' });
		}
		return items;
	}

	simulate(request: FermentationRequest): FermentationResult {
		let riceGrams = 0;
		let waterGrams = 0;
		let nurukGrams = 0;

		for (const item of request.ingredients) {
			const grams = toGrams(item.amount, item.unit);
			switch (item.kind) {
				case 'RICE':
					riceGrams += grams;
					break;
				case 'WATER':
					waterGrams += grams;
					break;
				case 'NURUK':
					nurukGrams += grams;
					break;
			}
		}

		const outcome = this.calculator.calculate({
			rice: Rice.ofGrams(riceGrams),
			water: Water.ofGrams(waterGrams),
			nuruk: Nuruk.ofGrams(nurukGrams),
			stageCount: request.stageCount
		});

		return {
			abvPercent: outcome.abvPercent,
			volumeLiters: outcome.volumeLiters,
			stages: outcome.stages.map((stage) => ({ ingredients: this.toStageIngredients(stage) }))
		};
	}
}
