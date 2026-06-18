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
    it('물을 충분히 넣어 농도가 낮으면 당이 모두 발효된 도수를 그대로 반환한다', () => {
      // 쌀 1kg · 물 3L → 잠재 도수가 효모 내성 한계보다 낮아 그대로 발효된다
      expect(estimator.estimate(makeRecipe(1000, 3000)).alcoholPercent).toBeCloseTo(10.6, 1);
    });

    it('물을 적게 넣어 농도가 높아도 효모 내성 한계를 넘지 못한다', () => {
      // 쌀 1kg · 물 1L → 화학량론상 한계를 크게 웃돌지만 효모가 사멸해 발효주로는 불가능하다
      expect(estimator.estimate(makeRecipe(1000, 1000)).alcoholPercent).toBeCloseTo(17.5, 1);
    });

    it('농도가 높아질수록 도수는 효모 내성 한계로 수렴한다', () => {
      const dilute = estimator.estimate(makeRecipe(1000, 3000)).alcoholPercent;
      const medium = estimator.estimate(makeRecipe(1000, 2000)).alcoholPercent;
      const concentrated = estimator.estimate(makeRecipe(1000, 1000)).alcoholPercent;
      expect(dilute).toBeLessThan(medium);
      expect(medium).toBeLessThan(concentrated);
      expect(concentrated).toBeLessThanOrEqual(17.5);
    });

    it('총 쌀·물량이 같으면 양조 단계 수와 무관하게 같은 도수를 반환한다', () => {
      // 단양주·이양주·삼양주 모두 쌀 1kg, 물 2L
      const danyang = estimator.estimate(makeRecipe(1000, 2000, 1));
      const iyang   = estimator.estimate(makeRecipe(1000, 2000, 2));
      const samyang = estimator.estimate(makeRecipe(1000, 2000, 3));
      expect(danyang.alcoholPercent).toBeCloseTo(iyang.alcoholPercent, 5);
      expect(iyang.alcoholPercent).toBeCloseTo(samyang.alcoholPercent, 5);
    });
  });
});
