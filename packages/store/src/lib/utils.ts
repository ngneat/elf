export function coerceArray<T>(value: T | T[]): T[];
export function coerceArray<T>(value: T | readonly T[]): readonly T[];
export function coerceArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
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

export function deepFreeze(o: any) {
  Object.freeze(o);

  const oIsFunction = typeof o === 'function';
  const hasOwnProp = Object.prototype.hasOwnProperty;

  Object.getOwnPropertyNames(o).forEach(function (prop) {
    if (
      hasOwnProp.call(o, prop) &&
      (oIsFunction
        ? prop !== 'caller' && prop !== 'callee' && prop !== 'arguments'
        : true) &&
      o[prop] !== null &&
      (typeof o[prop] === 'object' || typeof o[prop] === 'function') &&
      !Object.isFrozen(o[prop])
    ) {
      deepFreeze(o[prop]);
    }
  });

  return o;
}
