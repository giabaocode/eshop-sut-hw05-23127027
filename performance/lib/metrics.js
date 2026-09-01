// DRAFT — PINNED k6 INIT-VERIFIED; NO SUT TRAFFIC YET.
// Metric objects are intentionally module-global; correlation values are not.

import { Counter, Rate, Trend } from 'k6/metrics';

export const wf03WorkflowAttempted = new Counter('wf03_workflow_attempted');
export const wf03WorkflowSuccess = new Rate('wf03_workflow_success');
export const wf03Failures = new Counter('wf03_failures');
export const wf03UnexpectedAuthResponse = new Counter(
  'wf03_unexpected_auth_response',
);
export const wf03OrdersCreated = new Counter('wf03_orders_created');
export const wf03OrdersCanceled = new Counter('wf03_orders_canceled');
export const wf03LifecycleDuration = new Trend(
  'wf03_lifecycle_duration',
  true,
);

function baseTags(context) {
  return {
    workflow: 'wf03',
    scenario: context.scenario,
    traffic: 'measured',
  };
}

export function beginWorkflowAttempt(context) {
  wf03WorkflowAttempted.add(1, baseTags(context));
}

export function recordTerminalFailure(context, step, failureClass) {
  if (context.terminalFailureRecorded) {
    return;
  }
  context.terminalFailureRecorded = true;
  wf03Failures.add(1, {
    ...baseTags(context),
    step,
    failure_class: failureClass,
  });
}

export function recordUnexpectedAuthResponse(context, status) {
  wf03UnexpectedAuthResponse.add(1, {
    ...baseTags(context),
    status: String(status),
  });
}

export function recordOrderCreated(context) {
  wf03OrdersCreated.add(1, baseTags(context));
}

export function recordOrderCanceled(context) {
  wf03OrdersCanceled.add(1, baseTags(context));
}

export function startLifecycle(context) {
  if (context.lifecycleStartedAt === null) {
    context.lifecycleStartedAt = Date.now();
  }
}

export function emitOutcomeOnce(context, succeeded) {
  if (context.outcomeEmitted) {
    return;
  }
  context.outcomeEmitted = true;
  const success = succeeded === true;
  wf03WorkflowSuccess.add(success, baseTags(context));

  if (context.lifecycleStartedAt !== null && !context.lifecycleDurationEmitted) {
    context.lifecycleDurationEmitted = true;
    wf03LifecycleDuration.add(Date.now() - context.lifecycleStartedAt, {
      ...baseTags(context),
      outcome: success ? 'success' : 'incomplete',
    });
  }
}
