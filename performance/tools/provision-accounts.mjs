#!/usr/bin/env node
/*
 * DRAFT / NOT YET EXECUTED.
 * Provision WF-03 customers only through the real SUT registration API in a
 * preflighted disposable runtime. Never use this during a measured scenario.
 */

import { randomBytes } from 'node:crypto';
import {
  chmodSync,
  existsSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const APPROVED_TARGETS = new Set([
  'http://127.0.0.1:3000',
  'http://localhost:3000',
]);
const MAX_ACCOUNTS = 20;
const MARKER_NAME = '.wf03-disposable-runtime';
const MARKER_VALUE = 'WF03_DISPOSABLE_RUNTIME\n';
const scriptPath = fileURLToPath(import.meta.url);
const originalRoot = resolve(dirname(scriptPath), '..', '..');
let ownedTemporaryPath = null;
let redactedEvidencePath = null;
const attemptedAccountKeys = [];

class SetupError extends Error {
  constructor(code) {
    super(code);
    this.name = 'SetupError';
    this.code = code;
  }
}

function requireEnv(name) {
  const value = String(process.env[name] || '').trim();
  if (!value) throw new SetupError(`missing_${name.toLowerCase()}`);
  return value;
}

function isWithin(parent, child) {
  const result = relative(parent, child);
  return result !== '' && result !== '..' && !result.startsWith(`..${sep}`) && !isAbsolute(result);
}

function assertDisposableBoundary(runtimeRoot, privateDir) {
  const resolvedRuntime = realpathSync(runtimeRoot);
  const resolvedOriginal = realpathSync(originalRoot);
  if (!resolvedRuntime.startsWith(`/private/tmp${sep}`)) {
    throw new SetupError('runtime_not_under_private_tmp');
  }
  if (resolvedRuntime === resolvedOriginal || isWithin(resolvedOriginal, resolvedRuntime)) {
    throw new SetupError('runtime_is_original_repository');
  }

  const marker = join(resolvedRuntime, MARKER_NAME);
  if (!existsSync(marker) || readFileSync(marker, 'utf8') !== MARKER_VALUE) {
    throw new SetupError('disposable_marker_missing_or_invalid');
  }

  const runtimeDb = realpathSync(join(resolvedRuntime, 'backend', 'database.sqlite'));
  const originalDb = realpathSync(join(resolvedOriginal, 'backend', 'database.sqlite'));
  const runtimeStat = statSync(runtimeDb);
  const originalStat = statSync(originalDb);
  if (
    runtimeDb === originalDb ||
    (runtimeStat.dev === originalStat.dev && runtimeStat.ino === originalStat.ino)
  ) {
    throw new SetupError('runtime_database_is_original_database');
  }

  const resolvedPrivate = resolve(privateDir);
  if (!resolvedPrivate.startsWith(`/private/tmp${sep}`)) {
    throw new SetupError('private_directory_not_under_private_tmp');
  }
  if (
    resolvedPrivate === resolvedRuntime ||
    isWithin(resolvedRuntime, resolvedPrivate) ||
    resolvedPrivate === resolvedOriginal ||
    isWithin(resolvedOriginal, resolvedPrivate)
  ) {
    throw new SetupError('private_directory_inside_git_worktree');
  }
  return { resolvedRuntime, resolvedPrivate };
}

function parseCount() {
  const value = Number(requireEnv('WF03_ACCOUNT_COUNT'));
  if (!Number.isInteger(value) || value < 1 || value > MAX_ACCOUNTS) {
    throw new SetupError('account_count_outside_1_to_20');
  }
  return value;
}

function slot(value) {
  return String(value).padStart(2, '0');
}

function csvField(value) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

async function jsonRequest(url, options, expectedCode) {
  let response;
  try {
    response = await fetch(url, options);
  } catch {
    throw new SetupError('sut_request_failed');
  }
  let body;
  try {
    body = await response.json();
  } catch {
    throw new SetupError('sut_returned_invalid_json');
  }
  if (response.status !== expectedCode) {
    throw new SetupError('sut_returned_unexpected_status');
  }
  return body;
}

function privateOutputPaths(privateDir) {
  mkdirSync(privateDir, { recursive: true, mode: 0o700 });
  chmodSync(privateDir, 0o700);
  const credentials = join(privateDir, 'credentials.local.csv');
  const temporary = join(privateDir, '.credentials.local.csv.tmp');
  const evidence = join(privateDir, 'provisioning-evidence.redacted.json');
  for (const path of [credentials, temporary, evidence]) {
    if (existsSync(path)) throw new SetupError('private_output_already_exists');
  }
  return { credentials, temporary, evidence };
}

function writeRedactedEvidence(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, {
    encoding: 'utf8',
    flag: 'wx',
    mode: 0o600,
  });
}

async function main() {
  const baseUrl = requireEnv('WF03_BASE_URL').replace(/\/+$/, '');
  if (!APPROVED_TARGETS.has(baseUrl)) throw new SetupError('target_not_approved_localhost');
  const count = parseCount();
  const runtimeRoot = requireEnv('WF03_DISPOSABLE_ROOT');
  const privateDir = requireEnv('WF03_PRIVATE_DIR');
  const { resolvedPrivate } = assertDisposableBoundary(runtimeRoot, privateDir);
  const paths = privateOutputPaths(resolvedPrivate);
  ownedTemporaryPath = paths.temporary;
  redactedEvidencePath = paths.evidence;
  const rows = [];
  const accountKeys = [];

  for (let index = 1; index <= count; index += 1) {
    const suffix = slot(index);
    const accountKey = `wf03-customer-${suffix}`;
    attemptedAccountKeys.push(accountKey);
    const email = `hw05-23127027-wf03-customer-${suffix}@example.test`;
    const password = randomBytes(24).toString('base64url');
    const name = `HW05 WF03 Customer ${suffix}`;

    const registration = await jsonRequest(
      `${baseUrl}/api/register`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, password }),
      },
      200,
    );
    if (
      registration.message !== 'User registered successfully' ||
      !Number.isInteger(registration.id) ||
      registration.id < 1
    ) {
      throw new SetupError('registration_contract_failed');
    }

    const login = await jsonRequest(
      `${baseUrl}/api/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, password }),
      },
      200,
    );
    if (
      login.message !== 'Login successful' ||
      typeof login.token !== 'string' ||
      login.token.length === 0 ||
      !login.user ||
      login.user.email !== email ||
      login.user.role !== 'user' ||
      login.user.login_attempts !== 0 ||
      login.user.locked_until !== null
    ) {
      throw new SetupError('login_account_validation_failed');
    }

    const orders = await jsonRequest(
      `${baseUrl}/api/orders/my-orders`,
      {
        method: 'GET',
        headers: { Accept: 'application/json', Authorization: `Bearer ${login.token}` },
      },
      200,
    );
    if (!Array.isArray(orders) || orders.length !== 0) {
      throw new SetupError('starting_order_state_not_zero');
    }

    rows.push([accountKey, email, password, 'user']);
    accountKeys.push(accountKey);
  }

  const csv = [
    'account_key,email,password,expected_role',
    ...rows.map((row) => row.map(csvField).join(',')),
  ].join('\n');
  writeFileSync(paths.temporary, `${csv}\n`, {
    encoding: 'utf8',
    flag: 'wx',
    mode: 0o600,
  });
  renameSync(paths.temporary, paths.credentials);
  ownedTemporaryPath = null;
  chmodSync(paths.credentials, 0o600);

  writeRedactedEvidence(paths.evidence, {
    status: 'PASS',
    helper_status: 'DRAFT_NOT_YET_HUMAN_APPROVED_FOR_EXECUTION',
    account_count: count,
    account_keys: accountKeys,
    registration_api: 'POST /api/register',
    credential_validation: 'PASS',
    role_and_lock_validation: 'PASS',
    zero_starting_orders: 'PASS',
    secrets_in_evidence: false,
    completed_at: new Date().toISOString(),
  });
  redactedEvidencePath = null;

  process.stdout.write(
    `WF03 disposable provisioning complete: ${count} accounts; credentials and redacted evidence written privately.\n`,
  );
}

main().catch((error) => {
  const code = error instanceof SetupError ? error.code : 'unexpected_setup_failure';
  process.stderr.write(`WF03 provisioning failed safely: ${code}\n`);
  if (ownedTemporaryPath && existsSync(ownedTemporaryPath)) {
    rmSync(ownedTemporaryPath, { force: true });
  }
  if (redactedEvidencePath && !existsSync(redactedEvidencePath)) {
    try {
      writeRedactedEvidence(redactedEvidencePath, {
        status: 'FAIL',
        helper_status: 'DRAFT_NOT_YET_HUMAN_APPROVED_FOR_EXECUTION',
        failure_code: code,
        attempted_account_keys: attemptedAccountKeys,
        secrets_in_evidence: false,
        failed_at: new Date().toISOString(),
      });
    } catch {
      process.stderr.write('WF03 provisioning failure evidence could not be preserved.\n');
    }
  }
  process.exitCode = 1;
});
