import { asapScheduler, MonoTypeOperatorFunction } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

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

export function capitalize(key: string): string {
  return key.charAt(0).toUpperCase() + key.slice(1);
}

export function isObject(item: any) {
  return typeof item === 'object' && !Array.isArray(item) && item !== null;
}

export const asap = <T>(): MonoTypeOperatorFunction<T> =>
  debounceTime(0, asapScheduler);
