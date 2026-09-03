// OFFICIAL LOAD EXECUTED as run 20260902T092131+0700 after 2-VU Pilot validation.
// Load changes only workload configuration; business logic is shared.

import { getWorkload } from '../../config/workloads.js';
import { loadRuntimeConfig } from '../../config/runtime.js';
import { createDataSet } from '../../lib/data.js';
import { executeWf03 } from '../../lib/workflow.js';

const workload = getWorkload('load');
const runtime = loadRuntimeConfig('load');
const dataSet = createDataSet({
  scenario: 'load',
  requiredActiveAccounts: workload.requiredActiveAccounts,
  loadPublicCsv: () => open('../../data/workflow.csv'),
  loadCredentialCsv: () => open(runtime.credentialFile),
});

export const options = workload.options;

export function runWf03Scenario() {
  executeWf03({ dataSet, runtime });
}
