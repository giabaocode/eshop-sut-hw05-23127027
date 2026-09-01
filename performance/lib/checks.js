// DRAFT — PINNED k6 INIT-VERIFIED; NO SUT TRAFFIC YET.
// Stable check names implement the human-approved Phase E contract.

import { check } from 'k6';

export function isJsonObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function safeJson(response) {
  try {
    return response.json();
  } catch (_error) {
    return null;
  }
}

export function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}

export function normalizePositiveNumber(value) {
  if (
    typeof value === 'string' &&
    !/^(?:0|[1-9]\d*)(?:\.\d+)?$/.test(value)
  ) {
    return null;
  }
  if (typeof value !== 'number' && typeof value !== 'string') {
    return null;
  }
  const normalized = Number(value);
  return Number.isFinite(normalized) && normalized > 0 ? normalized : null;
}

function hasNoError(body) {
  return (
    isJsonObject(body) &&
    !Object.prototype.hasOwnProperty.call(body, 'error')
  );
}

export function validateLogin(response, credential, tags) {
  const body = safeJson(response);
  const ok = check(
    { response, body },
    {
      'login: status is 200': ({ response: current }) => current.status === 200,
      'login: body is valid JSON object': ({ body: current }) =>
        isJsonObject(current),
      'login: response indicates success': ({ body: current }) =>
        hasNoError(current) && current.message === 'Login successful',
      'login: token is non-empty': ({ body: current }) =>
        isJsonObject(current) &&
        typeof current.token === 'string' &&
        current.token.trim().length > 0,
      'login: identity matches dedicated credential': ({ body: current }) =>
        isJsonObject(current) &&
        isJsonObject(current.user) &&
        isPositiveInteger(current.user.id) &&
        current.user.email === credential.email,
      'login: role is user': ({ body: current }) =>
        isJsonObject(current) &&
        isJsonObject(current.user) &&
        current.user.role === credential.expected_role &&
        current.user.role === 'user',
      'login: account is unlocked': ({ body: current }) =>
        isJsonObject(current) &&
        isJsonObject(current.user) &&
        current.user.login_attempts === 0 &&
        current.user.locked_until === null,
    },
    tags,
  );
  return { ok, body };
}

export function validateSearch(response, expectedProductName, tags) {
  const body = safeJson(response);
  const matches = Array.isArray(body)
    ? body.filter((candidate) => candidate && candidate.name === expectedProductName)
    : [];
  const selected = matches.length === 1 ? matches[0] : null;
  const ok = check(
    { response, body, matches, selected },
    {
      'search: status is 200': ({ response: current }) => current.status === 200,
      'search: body is valid product array': ({ body: current }) =>
        Array.isArray(current) && current.every((candidate) => isJsonObject(candidate)),
      'search: exactly one expected product matches': ({ matches: current }) =>
        current.length === 1,
      'search: selected product id is valid': ({ selected: current }) =>
        isJsonObject(current) && isPositiveInteger(current.id),
    },
    tags,
  );
  return { ok, body, selected };
}

export function validateDetail(
  response,
  correlatedProductId,
  expectedProductName,
  tags,
) {
  const body = safeJson(response);
  const price = isJsonObject(body) ? normalizePositiveNumber(body.price) : null;
  const ok = check(
    { response, body, price },
    {
      'detail: status is 200': ({ response: current }) => current.status === 200,
      'detail: body is valid product object': ({ body: current }) =>
        isJsonObject(current) && Object.keys(current).length > 0,
      'detail: id matches correlated product id': ({ body: current }) =>
        isJsonObject(current) && current.id === correlatedProductId,
      'detail: name matches expected product': ({ body: current }) =>
        isJsonObject(current) && current.name === expectedProductName,
      'detail: price is positive and finite': ({ price: current }) =>
        current !== null,
    },
    tags,
  );
  return { ok, body, price };
}

export function validateCheckout(response, tags) {
  const body = safeJson(response);
  const ok = check(
    { response, body },
    {
      'checkout: status is 200': ({ response: current }) => current.status === 200,
      'checkout: body is valid JSON object': ({ body: current }) =>
        isJsonObject(current),
      'checkout: response indicates success': ({ body: current }) =>
        hasNoError(current) && current.message === 'Checkout successful',
      'checkout: new order id is valid': ({ body: current }) =>
        isJsonObject(current) && isPositiveInteger(current.orderId),
    },
    tags,
  );
  return { ok, body };
}

function sameOrderInvariant(body, expected) {
  return (
    isJsonObject(body) &&
    body.id === expected.orderId &&
    body.user_id === expected.userId &&
    normalizePositiveNumber(body.total_amount) === expected.totalAmount &&
    body.shipping_address === expected.shippingAddress
  );
}

export function validatePendingProbe(response, expected, tags) {
  const body = safeJson(response);
  const ok = check(
    { response, body },
    {
      'pending_probe: status is 200': ({ response: current }) =>
        current.status === 200,
      'pending_probe: body is valid order object': ({ body: current }) =>
        isJsonObject(current),
      'pending_probe: id matches correlated order id': ({ body: current }) =>
        isJsonObject(current) && current.id === expected.orderId,
      'pending_probe: owner matches authenticated user': ({ body: current }) =>
        isJsonObject(current) && current.user_id === expected.userId,
      'pending_probe: amount matches checkout total': ({ body: current }) =>
        isJsonObject(current) &&
        normalizePositiveNumber(current.total_amount) === expected.totalAmount,
      'pending_probe: address matches checkout address': ({ body: current }) =>
        isJsonObject(current) &&
        current.shipping_address === expected.shippingAddress,
      'pending_probe: state is pending': ({ body: current }) =>
        sameOrderInvariant(current, expected) && current.status === 'pending',
    },
    tags,
  );
  return { ok, body };
}

export function validateCancellationRequest(orderId, tags) {
  return check(
    { orderId },
    {
      'cancellation: request uses correlated order id': ({ orderId: current }) =>
        isPositiveInteger(current),
    },
    tags,
  );
}

export function validateCancellationResponse(response, tags) {
  const body = safeJson(response);
  const ok = check(
    { response, body },
    {
      'cancellation: status is 200': ({ response: current }) =>
        current.status === 200,
      'cancellation: body is valid JSON object': ({ body: current }) =>
        isJsonObject(current),
      'cancellation: response indicates success': ({ body: current }) =>
        hasNoError(current) && current.message === 'Order canceled successfully',
    },
    tags,
  );
  return { ok, body };
}

export function validateFinalProbe(response, expected, tags) {
  const body = safeJson(response);
  const ok = check(
    { response, body },
    {
      'final_probe: status is 200': ({ response: current }) =>
        current.status === 200,
      'final_probe: body is valid order object': ({ body: current }) =>
        isJsonObject(current),
      'final_probe: id matches correlated order id': ({ body: current }) =>
        isJsonObject(current) && current.id === expected.orderId,
      'final_probe: owner matches authenticated user': ({ body: current }) =>
        isJsonObject(current) && current.user_id === expected.userId,
      'final_probe: amount remains checkout total': ({ body: current }) =>
        isJsonObject(current) &&
        normalizePositiveNumber(current.total_amount) === expected.totalAmount,
      'final_probe: address remains checkout address': ({ body: current }) =>
        isJsonObject(current) &&
        current.shipping_address === expected.shippingAddress,
      'final_probe: state is canceled': ({ body: current }) =>
        sameOrderInvariant(current, expected) && current.status === 'canceled',
    },
    tags,
  );
  return { ok, body };
}
