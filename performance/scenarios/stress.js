// OFFICIAL STRESS NOT EXECUTED; shared WF-03 was runtime-validated by 2-VU Pilot.
// Stress changes only workload configuration; business logic is shared.

import { getWorkload } from '../config/workloads.js';
import { loadRuntimeConfig } from '../config/runtime.js';
import { createDataSet } from '../lib/data.js';
import { executeWf03 } from '../lib/workflow.js';

const workload = getWorkload('stress');
const runtime = loadRuntimeConfig('stress');
const dataSet = createDataSet({
  scenario: 'stress',
  requiredActiveAccounts: workload.requiredActiveAccounts,
  loadPublicCsv: () => open('../data/workflow.csv'),
  loadCredentialCsv: () => open(runtime.credentialFile),
});

export const options = workload.options;

export function runWf03Scenario() {
  executeWf03({ dataSet, runtime });
}
