import { describe, expect, it } from 'vitest';
import { MakgeolliEstimator } from './makgeolli-estimator';
import { MakgeolliRecipe, type MakgeolliRecipeId } from '../aggregates/makgeolli-recipe';
import { MakgeolliStage } from '../value-objects/makgeolli-stage';
import { MakgeolliStyle } from '../value-objects/makgeolli-style';
import { Mass } from '../value-objects/mass';
import { RiceForm } from '../value-objects/rice-form';

const estimator = new MakgeolliEstimator();
const GODUBAP = RiceForm.of('GODUBAP');

function makeRecipe(riceGrams: number, waterGrams: number, brewCount: 1 | 2 | 3 = 1): MakgeolliRecipe {
  const id = crypto.randomUUID() as MakgeolliRecipeId;
  const baseRice = Math.floor(riceGrams / brewCount);
  const baseWater = Math.floor(waterGrams / brewCount);
  const stages = Array.from({ length: brewCount }, (_, i) => {
    const isLast = i === brewCount - 1;
    return MakgeolliStage.of(
      GODUBAP,
      Mass.ofGrams(isLast ? riceGrams - baseRice * (brewCount - 1) : baseRice),
      Mass.ofGrams(isLast ? waterGrams - baseWater * (brewCount - 1) : baseWater),
      Mass.zero()
    );
  });
  return MakgeolliRecipe.create({
    id,
    style: MakgeolliStyle.of(brewCount),
    totalRice: Mass.ofGrams(riceGrams),
    stages
  });
}

describe('MakgeolliEstimator', () => {
  describe('예상 생산량', () => {
    it('쌀 1kg · 물 1L 기준 생산량이 1.3L다', () => {
      expect(estimator.estimate(makeRecipe(1000, 1000)).volumeLiters).toBeCloseTo(1.3, 5);
    });

    it('쌀 1kg · 물 2L 기준 생산량이 2.3L다', () => {
      expect(estimator.estimate(makeRecipe(1000, 2000)).volumeLiters).toBeCloseTo(2.3, 5);
    });

    it('쌀 1kg · 물 3L 기준 생산량이 3.3L다', () => {
      expect(estimator.estimate(makeRecipe(1000, 3000)).volumeLiters).toBeCloseTo(3.3, 5);
    });

    it('물 없이 쌀 1kg만 투입하면 생산량이 0.3L다', () => {
      expect(estimator.estimate(makeRecipe(1000, 0)).volumeLiters).toBeCloseTo(0.3, 5);
    });
  });

  describe('예상 알코올 도수', () => {
    it('쌀 1kg · 물 1L 기준 예상 도수가 약 30.5%다', () => {
      expect(estimator.estimate(makeRecipe(1000, 1000)).alcoholPercent).toBeCloseTo(30.54, 1);
    });

    it('쌀 1kg · 물 2L 기준 예상 도수가 약 17.3%다', () => {
      expect(estimator.estimate(makeRecipe(1000, 2000)).alcoholPercent).toBeCloseTo(17.26, 1);
    });

    it('쌀 1kg · 물 3L 기준 예상 도수가 약 12.0%다', () => {
      expect(estimator.estimate(makeRecipe(1000, 3000)).alcoholPercent).toBeCloseTo(12.03, 1);
    });

    it('총 쌀·물량이 같으면 양조 단계 수와 무관하게 같은 도수를 반환한다', () => {
      // 단양주·이양주·삼양주 모두 쌀 1kg, 물 2L → 생산량 2.3L → 약 17.3%
      const danyang = estimator.estimate(makeRecipe(1000, 2000, 1));
      const iyang   = estimator.estimate(makeRecipe(1000, 2000, 2));
      const samyang = estimator.estimate(makeRecipe(1000, 2000, 3));
      expect(danyang.alcoholPercent).toBeCloseTo(17.26, 1);
      expect(iyang.alcoholPercent).toBeCloseTo(17.26, 1);
      expect(samyang.alcoholPercent).toBeCloseTo(17.26, 1);
    });
  });
});
