import type { MakgeolliRecipe } from '../aggregates/makgeolli-recipe';

export interface MakgeolliProductionEstimates {
  volumeLiters: number;
  alcoholPercent: number;
}

// 전분가(0.72) × 가정 발효 보정 수율(0.75) × 에탄올전환율(0.511) / 에탄올밀도(0.789)
// 수율은 이론값이 아니라 가정 발효의 현실(관리 미흡·미완 발효)을 반영한 보수적 보정 계수다.
const ALCOHOL_COEFFICIENT = 0.3497;
// 쌀이 당화되면서 방출되는 수분 비율
const RICE_SACCHARIFICATION_WATER_RATIO = 0.3;
// 효모가 자신이 만든 알코올에 사멸하기 시작하는 도수(%) 상한.
// 이 위로는 당이 남아도 발효가 멈춰 발효주로는 도달할 수 없다.
const YEAST_ALCOHOL_TOLERANCE = 17.5;
// smooth-min 날카로움(1/%). 클수록 hard min에 가까워진다.
const SATURATION_SHARPNESS = 1;

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
    // 모든 당이 발효된다고 가정한 화학량론상 잠재 도수
    const potentialPercent = (riceKg * ALCOHOL_COEFFICIENT / volumeLiters) * 100;
    // 효모 내성 한계에서 매끄럽게 막는다
    return Math.max(0, this.smoothMin(potentialPercent, YEAST_ALCOHOL_TOLERANCE));
  }

  // 두 값의 최솟값을 경계 부근에서 매끄럽게 잇는 근사 (LogSumExp)
  private smoothMin(a: number, b: number): number {
    const k = SATURATION_SHARPNESS;
    return -Math.log(Math.exp(-k * a) + Math.exp(-k * b)) / k;
  }
}
