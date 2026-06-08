import type { MakgeolliRecipe } from '../aggregates/makgeolli-recipe';

export interface MakgeolliProductionEstimates {
  volumeLiters: number;
  alcoholPercent: number;
}

// 전분가(0.72) × 발효수율(0.85) × 에탄올전환율(0.511) / 에탄올밀도(0.789)
const ALCOHOL_COEFFICIENT = 0.397;
// 쌀이 당화되면서 방출되는 수분 비율
const RICE_SACCHARIFICATION_WATER_RATIO = 0.3;

export class MakgeolliEstimator {
  estimate(recipe: MakgeolliRecipe): MakgeolliProductionEstimates {
    const volumeLiters = this.estimateVolume(recipe);
    const alcoholPercent = this.estimateAlcohol(recipe, volumeLiters);
    return { volumeLiters, alcoholPercent };
  }

  private estimateVolume(recipe: MakgeolliRecipe): number {
    return recipe.totals.rice.liters * RICE_SACCHARIFICATION_WATER_RATIO + recipe.totals.water.liters;
  }

  private estimateAlcohol(recipe: MakgeolliRecipe, volumeLiters: number): number {
    if (volumeLiters <= 0) return 0;
    const riceKg = recipe.totals.rice.grams / 1000;
    return (riceKg * ALCOHOL_COEFFICIENT / volumeLiters) * 100;
  }
}
