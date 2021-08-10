import { isObject } from '../core/utils';

/**
 *
 * Add array item
 *
 * @example
 *
 * arrayAdd([1, 2, 3], 5)
 *
 * arrayAdd([1, 2, 3], 5, { prepend: true })
 *
 */
export function arrayAdd<T extends any[]>(
  arr: T,
  item: T[0],
  options: { prepend: boolean } = { prepend: false }
): T {
  return options.prepend ? ([item, ...arr] as T) : ([...arr, item] as T);
}

/**
 *
 * Remove array item
 *
 * @example
 *
 * arrayRemove([1, 2, 3], 2)
 *
 * arrayRemove([{ id: 1, title }, { id: 2, title }], 2)
 *
 * arrayRemove([{ _id: 1, title }, { _id: 2, title }], 2, { idKey: '_id' })
 *
 */
export function arrayRemove<T extends any[], IdKey extends keyof T[0]>(
  arr: T,
  id: T[0] extends Record<any, any> ? T[0][IdKey] : T[0],
  options?: T[0] extends Record<any, any> ? { idKey: IdKey } : never
): T {
  const isPrimitive = !isObject(arr[0]);
  const idKey = options?.idKey ?? ('id' as IdKey);

  return arr.filter((current) => {
    if (isPrimitive) {
      return id !== current;
    }

    return current[idKey] !== id;
  }) as T;
}

/**
 *
 * Update array item
 *
 * @example
 *
 * arrayUpdate([1, 2, 3], 2, 4)
 *
 * arrayUpdate([{ id: 1, title }, { id: 2, title }], 2, { title: 'foo' })
 *
 */
export function arrayUpdate<T extends any[], IdKey extends keyof T[0]>(
  arr: T,
  id: T[0] extends Record<any, any> ? T[0][IdKey] : T[0],
  item: Partial<T[0]>,
  options?: T[0] extends Record<any, any> ? { idKey: IdKey } : never
): T {
  const isPrimitive = !isObject(arr[0]);
  const idKey = options?.idKey ?? 'id';
  const handlePrimitive = () =>
    arr.map((current) => {
      if (current === id) {
        return item;
      }

      return current;
    });

  const handleObjects = () =>
    arr.map((current) => {
      if (current[idKey] === id) {
        return { ...current, ...item };
      }

      return current;
    });

  return isPrimitive ? (handlePrimitive() as T) : (handleObjects() as T);
}

/**
 *
 * Toggle array item
 *
 * @example
 *
 * arrayToggle([1, 2, 3], 2)
 *
 * arrayToggle([{ id: 1, title }, { id: 2, title }], { id: 1, title })
 *
 */
export function arrayToggle<T extends any[], IdKey extends keyof T[0]>(
  arr: T,
  item: T[0],
  options?: T[0] extends Record<any, any> ? { idKey: IdKey } : never
): T {
  const isPrimitive = !isObject(arr[0]);
  const idKey = options?.idKey ?? 'id';

  const isExists = arr.find((current) => {
    if (isPrimitive) {
      return current === item;
    }

    return item[idKey] === current[idKey];
  });

  return isExists
    ? arrayRemove(arr, isPrimitive ? item : item[idKey], options as any)
    : arrayAdd(arr, item);
}
