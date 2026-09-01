// RUNTIME-VALIDATED BY 2-VU PILOT; NOT AN OFFICIAL PERFORMANCE SCENARIO.
// The pilot changes only workload configuration and calls the shared WF-03.

import { getWorkload } from '../config/workloads.js';
import { loadRuntimeConfig } from '../config/runtime.js';
import { createDataSet } from '../lib/data.js';
import { executeWf03 } from '../lib/workflow.js';

const workload = getWorkload('pilot');
const runtime = loadRuntimeConfig('pilot');
const dataSet = createDataSet({
  scenario: 'pilot',
  requiredActiveAccounts: workload.requiredActiveAccounts,
  loadPublicCsv: () => open('../data/workflow.csv'),
  loadCredentialCsv: () => open(runtime.credentialFile),
});

export const options = workload.options;

export function runWf03Scenario() {
  executeWf03({ dataSet, runtime });
}
