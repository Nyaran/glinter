import _ from 'lodash';
import * as gherkinUtils from './utils/gherkin.js';
import {GherkinData, RuleError} from '../types.js';
import { featureSpread } from './utils/gherkin.js';

export const name = 'no-scenario-outlines-without-examples';

export function run({feature}: GherkinData): RuleError[] {
	if (!feature) {
		return [];
	}

	const errors = [] as RuleError[];
	featureSpread(feature).children.forEach(child => {
		if (child.scenario) {
			const {scenario} = child;
			const nodeType = gherkinUtils.getNodeType(scenario, feature.language);
			if (nodeType === 'Scenario Outline' &&  (!_.find(scenario.examples, 'tableBody')?.tableBody.length)) {
				errors.push({
					message: 'Scenario Outline does not have any Examples',
					rule   : name,
					line   : scenario.location.line,
					column : scenario.location.column,
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
