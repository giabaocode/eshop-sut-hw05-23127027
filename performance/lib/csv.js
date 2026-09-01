// RUNTIME-VALIDATED BY 2-VU PILOT; OFFICIAL PERFORMANCE EXECUTION NOT YET PERFORMED.
// Small dependency-free CSV parser for reviewed public/private schemas.

export function parseCsv(csvText, label) {
  if (typeof csvText !== 'string' || csvText.length === 0) {
    throw new Error(`WF03 setup/data error: ${label} CSV is empty`);
  }

  const text = csvText.charCodeAt(0) === 0xfeff ? csvText.slice(1) : csvText;
  const records = [];
  let record = [];
  let field = '';
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];

    if (quoted) {
      if (character === '"') {
        if (text[index + 1] === '"') {
          field += '"';
          index += 1;
        } else {
          quoted = false;
        }
      } else {
        field += character;
      }
      continue;
    }

    if (character === '"' && field.length === 0) {
      quoted = true;
    } else if (character === ',') {
      record.push(field);
      field = '';
    } else if (character === '\n' || character === '\r') {
      if (character === '\r' && text[index + 1] === '\n') {
        index += 1;
      }
      record.push(field);
      records.push(record);
      record = [];
      field = '';
    } else {
      field += character;
    }
  }

  if (quoted) {
    throw new Error(`WF03 setup/data error: ${label} CSV has an unterminated quote`);
  }
  if (field.length > 0 || record.length > 0) {
    record.push(field);
    records.push(record);
  }

  while (
    records.length > 0 &&
    records[records.length - 1].every((value) => value === '')
  ) {
    records.pop();
  }
  if (records.length < 2) {
    throw new Error(`WF03 setup/data error: ${label} CSV has no data rows`);
  }

  const headers = records[0].map((value) => value.trim());
  if (new Set(headers).size !== headers.length || headers.some((value) => !value)) {
    throw new Error(`WF03 setup/data error: ${label} CSV headers are invalid`);
  }

  return records.slice(1).map((values) => {
    if (values.length !== headers.length) {
      throw new Error(`WF03 setup/data error: ${label} CSV row width is invalid`);
    }
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index];
    });
    return row;
  });
}

export function requireExactHeaders(rows, expectedHeaders, label) {
  if (!rows || typeof rows.length !== 'number' || rows.length === 0) {
    throw new Error(`WF03 setup/data error: ${label} rows are unavailable`);
  }
  const actual = Object.keys(rows[0]);
  const exact =
    actual.length === expectedHeaders.length &&
    actual.every((value, index) => value === expectedHeaders[index]);
  if (!exact) {
    throw new Error(`WF03 setup/data error: ${label} schema is not approved`);
  }
}
