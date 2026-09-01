// RUNTIME-VALIDATED BY 2-VU PILOT; OFFICIAL PERFORMANCE EXECUTION NOT YET PERFORMED.
// This is the single authoritative executable WF-03 business implementation.

import http from 'k6/http';
import { group, sleep } from 'k6';
import exec from 'k6/execution';
import { performLogin } from './auth.js';
import { bindCurrentVu } from './data.js';
import {
  isJsonObject,
  isPositiveInteger,
  validateCancellationRequest,
  validateCancellationResponse,
  validateCheckout,
  validateDetail,
  validateFinalProbe,
  validatePendingProbe,
  validateSearch,
} from './checks.js';
import {
  beginWorkflowAttempt,
  emitOutcomeOnce,
  recordOrderCanceled,
  recordOrderCreated,
  recordTerminalFailure,
  recordUnexpectedAuthResponse,
  startLifecycle,
} from './metrics.js';

const STEP_METADATA = Object.freeze({
  login: Object.freeze({ endpointGroup: 'auth', operationRole: 'business' }),
  search: Object.freeze({ endpointGroup: 'read', operationRole: 'business' }),
  detail: Object.freeze({ endpointGroup: 'read', operationRole: 'business' }),
  checkout: Object.freeze({
    endpointGroup: 'transactional',
    operationRole: 'business',
  }),
  pending_probe: Object.freeze({
    endpointGroup: 'read',
    operationRole: 'verification',
  }),
  cancellation: Object.freeze({
    endpointGroup: 'transactional',
    operationRole: 'business',
  }),
  final_probe: Object.freeze({
    endpointGroup: 'read',
    operationRole: 'verification',
  }),
});

function stepTags(context, step) {
  const metadata = STEP_METADATA[step];
  return {
    name: `wf03_${step}`,
    workflow: 'wf03',
    step,
    endpoint_group: metadata.endpointGroup,
    operation_role: metadata.operationRole,
    traffic: context.traffic,
    scenario: context.scenario,
  };
}

function requestParams(context, step, jwt) {
  const headers = { Accept: 'application/json' };
  if (jwt) {
    headers.Authorization = `Bearer ${jwt}`;
  }
  return { headers, tags: stepTags(context, step) };
}

function jsonRequestParams(context, step, jwt) {
  const params = requestParams(context, step, jwt);
  params.headers['Content-Type'] = 'application/json';
  return params;
}

function thinkTime(minimumSeconds, maximumSeconds) {
  sleep(minimumSeconds + Math.random() * (maximumSeconds - minimumSeconds));
}

function responseFailureClass(response, body, assertionClass) {
  if (response && (response.status === 401 || response.status === 403)) {
    return 'authentication';
  }
  if (!response || response.status === 0 || response.status !== 200 || body === null) {
    return 'transport_protocol';
  }
  return assertionClass;
}

function fail(context, step, failureClass) {
  recordTerminalFailure(context, step, failureClass);
  return false;
}

function newIterationContext(binding, scenario, traffic) {
  return {
    scenario,
    traffic,
    workflowRow: binding.workflow,
    credential: binding.credential,
    jwt: null,
    userId: null,
    productId: null,
    price: null,
    orderId: null,
    succeeded: false,
    terminalFailureRecorded: false,
    outcomeEmitted: false,
    lifecycleStartedAt: null,
    lifecycleDurationEmitted: false,
  };
}

export function executeWf03({ dataSet, runtime }) {
  const binding = bindCurrentVu(dataSet);
  if (!binding) {
    return;
  }

  const context = newIterationContext(binding, runtime.scenario, runtime.traffic);
  beginWorkflowAttempt(context);

  try {
    let loginResult;
    group('wf03_01_login', () => {
      loginResult = performLogin({
        baseUrl: runtime.baseUrl,
        credential: context.credential,
        requestParams: jsonRequestParams(context, 'login'),
        checkTags: stepTags(context, 'login'),
      });
    });
    if (!loginResult.ok) {
      if (loginResult.response.status === 401 || loginResult.response.status === 403) {
        recordUnexpectedAuthResponse(context, loginResult.response.status);
      }
      fail(
        context,
        'login',
        responseFailureClass(loginResult.response, loginResult.body, 'authentication'),
      );
      return;
    }
    context.jwt = loginResult.body.token;
    context.userId = loginResult.body.user.id;
    thinkTime(0.5, 1.0);

    let searchResult;
    group('wf03_02_search', () => {
      const response = http.get(
        `${runtime.baseUrl}/api/products?search=${encodeURIComponent(
          context.workflowRow.search_term,
        )}`,
        requestParams(context, 'search'),
      );
      searchResult = { response, ...validateSearch(
        response,
        context.workflowRow.expected_product_name,
        stepTags(context, 'search'),
      ) };
    });
    if (!searchResult.ok) {
      fail(
        context,
        'search',
        responseFailureClass(searchResult.response, searchResult.body, 'correlation_data'),
      );
      return;
    }
    context.productId = searchResult.selected.id;
    thinkTime(1.0, 2.0);

    let detailResult;
    group('wf03_03_detail', () => {
      const response = http.get(
        `${runtime.baseUrl}/api/products/${context.productId}`,
        requestParams(context, 'detail'),
      );
      detailResult = { response, ...validateDetail(
        response,
        context.productId,
        context.workflowRow.expected_product_name,
        stepTags(context, 'detail'),
      ) };
    });
    if (!detailResult.ok) {
      const correlationFailed =
        isJsonObject(detailResult.body) &&
        detailResult.body.id !== context.productId;
      fail(
        context,
        'detail',
        responseFailureClass(
          detailResult.response,
          detailResult.body,
          correlationFailed ? 'correlation_data' : 'business_assertion',
        ),
      );
      return;
    }
    context.price = detailResult.price;
    thinkTime(1.5, 3.0);

    let checkoutResult;
    startLifecycle(context);
    group('wf03_04_checkout', () => {
      const response = http.post(
        `${runtime.baseUrl}/api/checkout`,
        JSON.stringify({
          total_amount: context.price,
          shipping_address: context.workflowRow.shipping_address,
        }),
        jsonRequestParams(context, 'checkout', context.jwt),
      );
      checkoutResult = { response, ...validateCheckout(
        response,
        stepTags(context, 'checkout'),
      ) };
    });
    if (!checkoutResult.ok) {
      const invalidOrderId =
        isJsonObject(checkoutResult.body) &&
        !isPositiveInteger(checkoutResult.body.orderId);
      fail(
        context,
        'checkout',
        responseFailureClass(
          checkoutResult.response,
          checkoutResult.body,
          invalidOrderId ? 'correlation_data' : 'business_assertion',
        ),
      );
      return;
    }
    context.orderId = checkoutResult.body.orderId;
    recordOrderCreated(context);

    const expectedOrder = {
      orderId: context.orderId,
      userId: context.userId,
      totalAmount: context.price,
      shippingAddress: context.workflowRow.shipping_address,
    };

    let pendingResult;
    group('wf03_05_pending_probe', () => {
      const response = http.get(
        `${runtime.baseUrl}/api/orders/${context.orderId}`,
        requestParams(context, 'pending_probe'),
      );
      pendingResult = { response, ...validatePendingProbe(
        response,
        expectedOrder,
        stepTags(context, 'pending_probe'),
      ) };
    });
    if (!pendingResult.ok) {
      fail(
        context,
        'pending_probe',
        responseFailureClass(pendingResult.response, pendingResult.body, 'lifecycle'),
      );
      return;
    }
    thinkTime(0.5, 1.0);

    let cancellationResult;
    group('wf03_06_cancellation', () => {
      const tags = stepTags(context, 'cancellation');
      const requestValid = validateCancellationRequest(context.orderId, tags);
      if (!requestValid) {
        cancellationResult = { ok: false, response: null, body: null };
        return;
      }
      const response = http.put(
        `${runtime.baseUrl}/api/orders/${context.orderId}/cancel`,
        JSON.stringify({}),
        jsonRequestParams(context, 'cancellation', context.jwt),
      );
      cancellationResult = { response, ...validateCancellationResponse(response, tags) };
    });
    if (!cancellationResult.ok) {
      fail(
        context,
        'cancellation',
        responseFailureClass(
          cancellationResult.response,
          cancellationResult.body,
          'lifecycle',
        ),
      );
      return;
    }

    let finalResult;
    group('wf03_07_final_probe', () => {
      const response = http.get(
        `${runtime.baseUrl}/api/orders/${context.orderId}`,
        requestParams(context, 'final_probe'),
      );
      finalResult = { response, ...validateFinalProbe(
        response,
        expectedOrder,
        stepTags(context, 'final_probe'),
      ) };
    });
    if (!finalResult.ok) {
      fail(
        context,
        'final_probe',
        responseFailureClass(finalResult.response, finalResult.body, 'lifecycle'),
      );
      return;
    }

    recordOrderCanceled(context);
    context.succeeded = true;
  } catch (_error) {
    recordTerminalFailure(context, 'setup', 'runtime_safety');
    emitOutcomeOnce(context, false);
    console.error(
      'WF03 sanitized harness diagnostic: unexpected script/runtime exception; aborting test',
    );
    exec.test.abort(
      'WF03 runtime/safety abort: unexpected test-harness exception',
    );
  } finally {
    emitOutcomeOnce(context, context.succeeded);
  }
}
