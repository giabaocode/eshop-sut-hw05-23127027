# WF-03 Performance-Test Data

## Trackable public data

`workflow.csv` is the approved non-secret 20-row WF-03 dataset. Each one-based
row/account suffix is reserved for the equally numbered VU in a future local
single-instance run. It contains no credentials or response-owned identifiers.

Schema:

```text
row_id,account_key,search_term,expected_product_name,shipping_address
```

Quantity is intentionally absent. The verified WF-03 flow sends checkout JSON
with only `total_amount` and `shipping_address`; the amount is the normalized
price from product detail. The selected flow does not submit or use quantity.

`credentials.template.csv` contains only a header and non-secret placeholders.
It is documentation, not an authenticatable credential file.

## Runtime-private credentials

Future provisioning must create real credentials under the disposable runtime,
outside this repository, using this private schema:

```text
account_key,email,password,expected_role
```

The repository-local fallback `credentials.local.csv` is ignored, but the
runtime-private external path remains preferred. Never put passwords or JWTs in
Git, terminal output, screenshots, reports, request tags, or AI Audit records.
The future provisioning helper must write valid CSV quoting and should generate
secrets from a secure local source without echoing them. The Phase F draft
rejects empty or template-placeholder passwords and joins credentials by the
exact `account_key` rather than row-position fallback.

## Dynamic response values

JWT, authenticated user ID, product ID, product price, derived checkout total,
and order ID are deliberately absent from static data. They must be extracted
or derived within the current iteration with no fallback to another VU or a
previous iteration.

## Current boundary

No account has been provisioned and no real credential file exists. Phase F has
created clearly labeled **DRAFT — NOT RUNTIME VERIFIED** k6 source for static
human review; it has not been installed or executed. See
[`../../docs/test-data-strategy.md`](../../docs/test-data-strategy.md),
[`../../docs/correlation-strategy.md`](../../docs/correlation-strategy.md), and
[`../../docs/k6-architecture.md`](../../docs/k6-architecture.md).
