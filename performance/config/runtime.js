// RUNTIME-VALIDATED BY 2-VU PILOT; OFFICIAL PERFORMANCE EXECUTION NOT YET PERFORMED.
// Runtime values are read in k6 init context and contain no committed secrets.

const APPROVED_LOCAL_TARGETS = Object.freeze([
  'http://127.0.0.1:3000',
  'http://localhost:3000',
]);

function normalizeBaseUrl(value) {
  return String(value || '').trim().replace(/\/+$/, '');
}

export function loadRuntimeConfig(expectedScenario) {
  const baseUrl = normalizeBaseUrl(__ENV.WF03_BASE_URL);
  if (!APPROVED_LOCAL_TARGETS.includes(baseUrl)) {
    throw new Error(
      'WF03 safety error: WF03_BASE_URL must name the approved local disposable target',
    );
  }

  const credentialFile = String(
    __ENV.WF03_CREDENTIALS_FILE || '../data/credentials.local.csv',
  ).trim();
  if (!credentialFile) {
    throw new Error('WF03 setup/data error: private credential-file path is missing');
  }

  return Object.freeze({
    baseUrl,
    credentialFile,
    scenario: expectedScenario,
    traffic: expectedScenario === 'pilot' ? 'pilot' : 'measured',
  });
}
