import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
	calculateDanyang,
	calculateIyang,
	calculateSamyang
} from '../../../apps/web/src/lib/calculator/makgeolli';
import type { BrewResult, RiceForm } from '../../../apps/web/src/lib/types';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUTPUT = resolve(HERE, '__fixtures__/makgeolli-golden.json');

interface InputCase {
	totalRice: number;
	waterRatio: number; // fraction
	nurukRatio: number; // fraction
}

const INPUTS: InputCase[] = [
	{ totalRice: 1000, waterRatio: 1.0, nurukRatio: 0.1 },
	{ totalRice: 1500, waterRatio: 1.2, nurukRatio: 0.15 },
	{ totalRice: 800, waterRatio: 0.8, nurukRatio: 0.08 },
	{ totalRice: 2000, waterRatio: 1.0, nurukRatio: 0.1 }
];

const RICE_FORMS: RiceForm[] = ['godubap', 'tteok', 'beombuk', 'juk'];
const STYLES = ['danyang', 'iyang', 'samyang'] as const;

const LABEL_TO_RICE_FORM: Record<string, RiceForm> = {
	고두밥: 'godubap',
	'떡 (설기)': 'tteok',
	범벅: 'beombuk',
	죽: 'juk'
};

function callWeb(style: (typeof STYLES)[number], rice: number, form: RiceForm, water: number, nurukPercent: number): BrewResult {
	switch (style) {
		case 'danyang':
			return calculateDanyang(rice, form, water, nurukPercent);
		case 'iyang':
			return calculateIyang(rice, form, water, nurukPercent);
		case 'samyang':
			return calculateSamyang(rice, form, water, nurukPercent);
	}
}

interface Fixture {
	input: InputCase & { riceForm: RiceForm; style: (typeof STYLES)[number] };
	expected: {
		type: BrewResult['type'];
		stages: { name: string; riceForm: RiceForm; rice: number; water: number; nuruk: number }[];
		totalRice: number;
		totalWater: number;
		totalNuruk: number;
	};
}

const fixtures: Fixture[] = [];
for (const riceForm of RICE_FORMS) {
	for (const style of STYLES) {
		for (const input of INPUTS) {
			// makgeolli.ts uses nurukRatio as PERCENT (10 = 10%); domain uses fraction.
			const result = callWeb(style, input.totalRice, riceForm, input.waterRatio, input.nurukRatio * 100);
			fixtures.push({
				input: { ...input, riceForm, style },
				expected: {
					type: result.type,
					stages: result.stages.map((s) => {
						const mappedForm = LABEL_TO_RICE_FORM[s.riceFormLabel];
						if (!mappedForm) {
							throw new Error(`Unknown riceFormLabel: ${s.riceFormLabel}`);
						}
						return {
							name: s.name,
							riceForm: mappedForm,
							rice: s.rice,
							water: s.water,
							nuruk: s.nuruk
						};
					}),
					totalRice: result.totalRice,
					totalWater: result.totalWater,
					totalNuruk: result.totalNuruk
				}
			});
		}
	}
}

mkdirSync(dirname(OUTPUT), { recursive: true });
writeFileSync(OUTPUT, JSON.stringify(fixtures, null, 2) + '\n', 'utf8');
console.log(`Wrote ${fixtures.length} fixtures to ${OUTPUT}`);
