// DRAFT — NOT RUNTIME VERIFIED.
// Authentication request/validation is isolated; JWT ownership remains iteration-local.

import http from 'k6/http';
import { validateLogin } from './checks.js';

export function performLogin({ baseUrl, credential, requestParams, checkTags }) {
  const response = http.post(
    `${baseUrl}/api/login`,
    JSON.stringify({
      email: credential.email,
      password: credential.password,
    }),
    requestParams,
  );
  return {
    response,
    ...validateLogin(response, credential, checkTags),
  };
}
