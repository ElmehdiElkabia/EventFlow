const BLOCKED_OBJECT_KEYS = new Set(['__proto__', 'prototype', 'constructor']);

const isPlainObject = (value) => {
  return Object.prototype.toString.call(value) === '[object Object]';
};

const sanitizeValue = (value) => {
  if (value === undefined || typeof value === 'function') {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  if (Array.isArray(value)) {
    return value
      .map(sanitizeValue)
      .filter((item) => item !== undefined);
  }

  if (value instanceof Date || value instanceof FormData || value instanceof Blob) {
    return value;
  }

  if (isPlainObject(value)) {
    const sanitized = {};

    for (const [key, rawEntry] of Object.entries(value)) {
      if (BLOCKED_OBJECT_KEYS.has(key)) {
        continue;
      }

      const entry = sanitizeValue(rawEntry);
      if (entry !== undefined) {
        sanitized[key] = entry;
      }
    }

    return sanitized;
  }

  return value;
};

export const secureId = (id, fieldName = 'id') => {
  if (id === null || id === undefined) {
    throw new Error(`${fieldName} is required`);
  }

  const normalized = String(id).trim();
  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }

  return encodeURIComponent(normalized);
};

export const securePayload = (payload = {}) => {
  if (payload instanceof FormData) {
    return payload;
  }

  return sanitizeValue(payload);
};

export const secureParams = (params = {}) => {
  return sanitizeValue(params);
};
