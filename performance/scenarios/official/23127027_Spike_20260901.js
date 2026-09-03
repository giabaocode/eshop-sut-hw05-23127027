// OFFICIAL SPIKE EXECUTED as run 20260902T104549+0700 after 2-VU Pilot validation.
// Spike changes only workload configuration; business logic is shared.

import { getWorkload } from '../../config/workloads.js';
import { loadRuntimeConfig } from '../../config/runtime.js';
import { createDataSet } from '../../lib/data.js';
import { executeWf03 } from '../../lib/workflow.js';

const workload = getWorkload('spike');
const runtime = loadRuntimeConfig('spike');
const dataSet = createDataSet({
  scenario: 'spike',
  requiredActiveAccounts: workload.requiredActiveAccounts,
  loadPublicCsv: () => open('../../data/workflow.csv'),
  loadCredentialCsv: () => open(runtime.credentialFile),
});

export const options = workload.options;

export function runWf03Scenario() {
  executeWf03({ dataSet, runtime });
}
