import * as gherkinUtils from './utils/gherkin.js';
import {GherkinData, RuleError} from '../types.js';
import { featureSpread } from './utils/gherkin.js';

export const name = 'no-examples-in-scenarios';

export function run({feature}: GherkinData): RuleError[] {
	if (!feature) {
		return [];
	}
	const errors = [] as RuleError[];

	const {children} = featureSpread(feature);

	children.forEach((child) => {
		if (child.scenario) {
			const nodeType = gherkinUtils.getNodeType(child.scenario, feature.language);

			if (nodeType === 'Scenario' && child.scenario.examples.length) {
				errors.push({
					message: 'Cannot use "Examples" in a "Scenario", use a "Scenario Outline" instead',
					rule   : name,
					line   : child.scenario.location.line,
					column : child.scenario.location.column,
				});
			}
		}
	});
	return errors;
}

export const documentation = {
	description: 'TODO',
	fixable: false,
	configurable: true,
	examples: [{
		title: 'Example',
		description: 'TODO',
		config: {
			'': 'error',
		}
	}],
};
