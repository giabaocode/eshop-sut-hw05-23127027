// DRAFT — NOT RUNTIME VERIFIED.
// Only immutable input rows are shared. Response-derived correlation is never stored here.

import exec from 'k6/execution';
import { SharedArray } from 'k6/data';
import { parseCsv, requireExactHeaders } from './csv.js';

const PUBLIC_HEADERS = Object.freeze([
  'row_id',
  'account_key',
  'search_term',
  'expected_product_name',
  'shipping_address',
]);
const PRIVATE_HEADERS = Object.freeze([
  'account_key',
  'email',
  'password',
  'expected_role',
]);
const PUBLIC_ROW_COUNT = 20;

function slotSuffix(slot) {
  return String(slot).padStart(2, '0');
}

function failData(message) {
  throw new Error(`WF03 setup/data error: ${message}`);
}

function validatePublicRows(rows) {
  requireExactHeaders(rows, PUBLIC_HEADERS, 'public workflow');
  if (rows.length !== PUBLIC_ROW_COUNT) {
    failData('public workflow must contain exactly 20 approved rows');
  }

  const keys = new Set();
  rows.forEach((row, index) => {
    const suffix = slotSuffix(index + 1);
    if (
      row.row_id !== `wf03-row-${suffix}` ||
      row.account_key !== `wf03-customer-${suffix}` ||
      !row.search_term ||
      !row.expected_product_name ||
      !row.shipping_address
    ) {
      failData('public workflow row identity/content is invalid');
    }
    if (keys.has(row.account_key)) {
      failData('public workflow account key is duplicated');
    }
    keys.add(row.account_key);
  });
}

function validateCredentialRows(rows, requiredActiveAccounts) {
  requireExactHeaders(rows, PRIVATE_HEADERS, 'private credential');
  if (rows.length < requiredActiveAccounts || rows.length > PUBLIC_ROW_COUNT) {
    failData('private credential row count cannot satisfy the scenario');
  }

  const keys = new Set();
  rows.forEach((row) => {
    if (
      !/^wf03-customer-\d{2}$/.test(row.account_key) ||
      !row.email ||
      !row.password ||
      row.password === '<generated-at-provisioning>' ||
      row.expected_role !== 'user'
    ) {
      failData('private credential row is invalid or still a placeholder');
    }
    if (keys.has(row.account_key)) {
      failData('private credential account key is duplicated');
    }
    keys.add(row.account_key);
  });
}

export function createDataSet({
  scenario,
  requiredActiveAccounts,
  loadPublicCsv,
  loadCredentialCsv,
}) {
  const publicRows = new SharedArray(`wf03-${scenario}-public`, () =>
    parseCsv(loadPublicCsv(), 'public workflow'),
  );
  const credentialRows = new SharedArray(`wf03-${scenario}-private`, () =>
    parseCsv(loadCredentialCsv(), 'private credential'),
  );

  validatePublicRows(publicRows);
  validateCredentialRows(credentialRows, requiredActiveAccounts);

  const approvedRows = [];
  for (let index = 0; index < requiredActiveAccounts; index += 1) {
    const publicRow = publicRows[index];
    const expectedKey = publicRow.account_key;
    const credentials = [];
    for (let credentialIndex = 0; credentialIndex < credentialRows.length; credentialIndex += 1) {
      const candidate = credentialRows[credentialIndex];
      if (candidate.account_key === expectedKey) {
        credentials.push(candidate);
      }
    }
    if (credentials.length !== 1) {
      failData('required public/private account mapping is incomplete');
    }

    const suffix = slotSuffix(index + 1);
    const expectedEmail = `hw05-23127027-wf03-customer-${suffix}@example.test`;
    if (credentials[0].email !== expectedEmail) {
      failData('private credential identity does not match its approved slot');
    }
    approvedRows.push(Object.freeze({
      workflow: publicRow,
      credential: credentials[0],
    }));
  }

  return Object.freeze({
    scenario,
    requiredActiveAccounts,
    approvedRows: Object.freeze(approvedRows),
  });
}

export function bindCurrentVu(dataSet) {
  const vuId = exec.vu.idInTest;
  if (
    !Number.isInteger(vuId) ||
    vuId < 1 ||
    vuId > dataSet.approvedRows.length
  ) {
    exec.test.abort(
      'WF03 setup/data error: VU identifier is outside available approved rows',
    );
    return null;
  }

  const binding = dataSet.approvedRows[vuId - 1];
  if (!binding || binding.workflow.account_key !== binding.credential.account_key) {
    exec.test.abort('WF03 setup/data error: dedicated VU account binding failed');
    return null;
  }
  return binding;
}
