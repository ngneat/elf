import { SomeArray } from './types';

export function coerceArray<T>(value: T | SomeArray<T>): SomeArray<T> {
  return Array.isArray(value) ? value : [value as T];
}

export function isFunction(value: any): value is (...args: any[]) => any {
  return typeof value === 'function';
}

export function isUndefined(value: any): value is undefined {
  return value === undefined;
}

export function isString(value: any): value is string {
  return typeof value === 'string';
}

export function capitalize(key: string): string {
  return key.charAt(0).toUpperCase() + key.slice(1);
}

export function isObject(item: any) {
  return typeof item === 'object' && !Array.isArray(item) && item !== null;
}
