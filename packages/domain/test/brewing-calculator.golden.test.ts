import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { BrewingCalculator } from '../src/brewing/services/brewing-calculator';
import { BrewingStyle, type BrewingStyleCode } from '../src/brewing/value-objects/brewing-style';
import { Mass } from '../src/brewing/value-objects/mass';
import { Ratio } from '../src/brewing/value-objects/ratio';
import { RiceForm, type RiceFormCode } from '../src/brewing/value-objects/rice-form';

const HERE = dirname(fileURLToPath(import.meta.url));
const FIXTURE_PATH = resolve(HERE, '__fixtures__/makgeolli-golden.json');

interface Fixture {
	input: {
		totalRice: number;
		waterRatio: number;
		nurukRatio: number;
		riceForm: RiceFormCode;
		style: BrewingStyleCode;
	};
	expected: {
		type: BrewingStyleCode;
		stages: { name: string; riceForm: RiceFormCode; rice: number; water: number; nuruk: number }[];
		totalRice: number;
		totalWater: number;
		totalNuruk: number;
	};
}

const fixtures: Fixture[] = JSON.parse(readFileSync(FIXTURE_PATH, 'utf8'));
const TOLERANCE = 1e-9;

const calculator = new BrewingCalculator();

describe('BrewingCalculator (golden)', () => {
	for (const fx of fixtures) {
		const { input, expected } = fx;
		const label = `${input.style} / ${input.riceForm} / rice=${input.totalRice} water=${input.waterRatio} nuruk=${input.nurukRatio}`;

		it(label, () => {
			const recipe = calculator.calculate({
				totalRice: Mass.of(input.totalRice),
				riceForm: RiceForm.fromCode(input.riceForm),
				waterRatio: Ratio.ofFraction(input.waterRatio),
				nurukRatio: Ratio.ofFraction(input.nurukRatio),
				style: BrewingStyle.fromCode(input.style)
			});

			expect(recipe.style.code).toBe(expected.type);
			expect(recipe.stages.length).toBe(expected.stages.length);

			for (let i = 0; i < expected.stages.length; i++) {
				const got = recipe.stages[i]!;
				const want = expected.stages[i]!;
				expect(got.name, `stage ${i} name`).toBe(want.name);
				expect(got.riceForm.code, `stage ${i} riceForm`).toBe(want.riceForm);
				expect(got.rice.grams, `stage ${i} rice`).toBeCloseTo(want.rice, 9);
				expect(got.water.grams, `stage ${i} water`).toBeCloseTo(want.water, 9);
				expect(got.nuruk.grams, `stage ${i} nuruk`).toBeCloseTo(want.nuruk, 9);
			}

			expect(recipe.totals.rice.grams).toBeCloseTo(expected.totalRice, 9);
			expect(recipe.totals.water.grams).toBeCloseTo(expected.totalWater, 9);
			expect(recipe.totals.nuruk.grams).toBeCloseTo(expected.totalNuruk, 9);

			expect(Math.abs(recipe.totals.rice.grams - input.totalRice)).toBeLessThan(TOLERANCE);
		});
	}
});
