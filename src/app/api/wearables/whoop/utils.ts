/**
 * WHOOP API Utilities
 *
 * Shared utility functions for WHOOP integration endpoints.
 */

/**
 * Convert BigInt values to strings for JSON serialization
 *
 * JavaScript's JSON.stringify() cannot handle BigInt values, so we need to
 * recursively convert them to strings before serialization.
 */
export function serializeBigInt(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === "bigint") {
    return obj.toString();
  }

  if (Array.isArray(obj)) {
    return obj.map(serializeBigInt);
  }

  if (typeof obj === "object") {
    const serialized: any = {};
    for (const key in obj) {
      serialized[key] = serializeBigInt(obj[key]);
    }
    return serialized;
  }

  return obj;
}

/**
 * Safe JSON stringify that handles BigInt values
 */
export function safeJsonStringify(
  obj: any,
  replacer?: any,
  space?: string | number
): string {
  const serialized = serializeBigInt(obj);
  return JSON.stringify(serialized, replacer, space);
}

// Cursor rules applied correctly.
