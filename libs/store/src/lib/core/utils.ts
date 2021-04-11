export function coerceArray<T>(value: T | T[]): T[];
export function coerceArray<T>(value: T | readonly T[]): readonly T[];
export function coerceArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunction(value: any): value is Function {
  return typeof value === 'function';
}

export function isUndefined(value: any): value is undefined {
  return value === undefined;
}

export function isString(value: any): value is string {
  return typeof value === 'string';
}
