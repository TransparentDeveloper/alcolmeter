import { type MakgeolliRecipeId } from './aggregates/makgeolli-recipe';
import { MakgeolliRecipePlanner, type MakgeolliInput } from './services/makgeolli-recipe-planner';
import { MakgeolliEstimator } from './services/makgeolli-estimator';
import { MakgeolliStyle } from './value-objects/makgeolli-style';
import { Mass } from './value-objects/mass';
import { RiceForm } from './value-objects/rice-form';

export interface MakgeolliRequest {
  totalRiceGrams: number;
  riceForm: 'GODUBAP' | 'TTEOK' | 'BEOMBUK' | 'JUK';
  waterRatio: number;
  nurukRatio: number;
  brewCount: 1 | 2 | 3;
}

export interface MakgeolliStageResult {
  riceForm: 'GODUBAP' | 'TTEOK' | 'BEOMBUK' | 'JUK';
  riceGrams: number;
  waterGrams: number;
  nurukGrams: number;
}

export interface MakgeolliResult {
  brewCount: 1 | 2 | 3;
  totalRiceGrams: number;
  totalWaterGrams: number;
  totalNurukGrams: number;
  stages: MakgeolliStageResult[];
  estimates: {
    volumeLiters: number;
    alcoholPercent: number;
  };
}

export class MakgeolliController {
  private readonly recipePlanner = new MakgeolliRecipePlanner();
  private readonly estimator = new MakgeolliEstimator();

  calculate(request: MakgeolliRequest): MakgeolliResult {
    const id = crypto.randomUUID() as MakgeolliRecipeId;
    const input: MakgeolliInput = {
      totalRice: Mass.ofGrams(request.totalRiceGrams),
      riceForm: RiceForm.of(request.riceForm),
      waterRatio: request.waterRatio,
      nurukRatio: request.nurukRatio,
      style: MakgeolliStyle.of(request.brewCount)
    };

    const recipe = this.recipePlanner.calculate(id, input);
    const estimates = this.estimator.estimate(recipe);

    return {
      brewCount: recipe.style.brewCount,
      totalRiceGrams: recipe.totals.rice.grams,
      totalWaterGrams: recipe.totals.water.grams,
      totalNurukGrams: recipe.totals.nuruk.grams,
      stages: recipe.stages.map((s) => ({
        riceForm: s.riceForm.code,
        riceGrams: s.rice.grams,
        waterGrams: s.water.grams,
        nurukGrams: s.nuruk.grams
      })),
      estimates: {
        volumeLiters: estimates.volumeLiters,
        alcoholPercent: estimates.alcoholPercent
      }
    };
  }
}
