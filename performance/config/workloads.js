// DRAFT — PINNED k6 INIT-VERIFIED; NO SUT TRAFFIC YET.
// Static representation of human-approved planning workloads.

function scenarioOptions(name, stages) {
  return {
    // Exclude the native `url` system tag so dynamic order paths do not create
    // high-cardinality metric series. Stable request `name` tags are mandatory.
    systemTags: [
      'status',
      'method',
      'name',
      'group',
      'check',
      'error_code',
      'expected_response',
      'scenario',
    ],
    scenarios: {
      [`wf03_${name}`]: {
        executor: 'ramping-vus',
        exec: 'runWf03Scenario',
        startVUs: 0,
        stages,
        gracefulRampDown: '30s',
        gracefulStop: '30s',
        tags: {
          workflow: 'wf03',
          scenario: name,
          traffic: name === 'pilot' ? 'pilot' : 'measured',
        },
      },
    },
  };
}

const loadStages = [
  { duration: '1m', target: 5 },
  { duration: '5m', target: 5 },
  { duration: '1m', target: 0 },
];

// Conservative Phase B pilot retained for compatibility/correlation review.
// This is not an official Load/Stress/Spike scenario or performance result.
const pilotStages = [
  { duration: '30s', target: 2 },
  { duration: '3m', target: 2 },
  { duration: '30s', target: 0 },
];

const stressStages = [
  { duration: '30s', target: 2 },
  { duration: '1m', target: 2 },
  { duration: '1m', target: 5 },
  { duration: '1m', target: 5 },
  { duration: '1m', target: 10 },
  { duration: '1m', target: 10 },
  { duration: '1m', target: 15 },
  { duration: '1m', target: 15 },
  { duration: '1m', target: 20 },
  { duration: '1m', target: 20 },
  { duration: '1m', target: 5 },
  { duration: '1m', target: 5 },
  { duration: '1m', target: 0 },
];

const spikeStages = [
  { duration: '30s', target: 3 },
  { duration: '2m', target: 3 },
  { duration: '10s', target: 20 },
  { duration: '45s', target: 20 },
  { duration: '10s', target: 3 },
  { duration: '2m', target: 3 },
  { duration: '30s', target: 0 },
];

export const WORKLOADS = Object.freeze({
  pilot: Object.freeze({
    name: 'pilot',
    requiredActiveAccounts: 2,
    plannedDuration: '4m',
    wallClockSafetyCap: '5m',
    options: scenarioOptions('pilot', pilotStages),
  }),
  load: Object.freeze({
    name: 'load',
    requiredActiveAccounts: 5,
    plannedDuration: '7m',
    wallClockSafetyCap: '8m',
    options: scenarioOptions('load', loadStages),
  }),
  stress: Object.freeze({
    name: 'stress',
    requiredActiveAccounts: 20,
    plannedDuration: '12m30s',
    wallClockSafetyCap: '14m',
    options: scenarioOptions('stress', stressStages),
  }),
  spike: Object.freeze({
    name: 'spike',
    requiredActiveAccounts: 20,
    plannedDuration: '6m5s',
    wallClockSafetyCap: '7m',
    options: scenarioOptions('spike', spikeStages),
  }),
});

export function getWorkload(name) {
  const workload = WORKLOADS[name];
  if (!workload) {
    throw new Error('WF03 setup/data error: unknown static scenario');
  }
  return workload;
}
