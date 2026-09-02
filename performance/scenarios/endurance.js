// EVIDENCE-INFORMED ENDURANCE / SOAK ENTRY.
// Uses the same shared WF-03 business implementation as official scenarios.

import { getWorkload } from '../config/workloads.js';
import { loadRuntimeConfig } from '../config/runtime.js';
import { createDataSet } from '../lib/data.js';
import { executeWf03 } from '../lib/workflow.js';

const workload = getWorkload('endurance');
const runtime = loadRuntimeConfig('endurance');
const dataSet = createDataSet({
  scenario: 'endurance',
  requiredActiveAccounts: workload.requiredActiveAccounts,
  loadPublicCsv: () => open('../data/workflow.csv'),
  loadCredentialCsv: () => open(runtime.credentialFile),
});

export const options = workload.options;

export function runWf03Scenario() {
  executeWf03({ dataSet, runtime });
}
