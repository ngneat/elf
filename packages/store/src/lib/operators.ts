import {
  asapScheduler,
  MonoTypeOperatorFunction,
  OperatorFunction,
  pipe,
} from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
} from 'rxjs/operators';
import { Action, EntityActions } from './actions';
import { coerceArray } from './utils';

export function select<T, R>(mapFn: (state: T) => R): OperatorFunction<T, R> {
  return pipe(map(mapFn), distinctUntilChanged());
}

export function head<
  T extends any[],
  Item = T extends (infer I)[] ? I : never
>(): OperatorFunction<T, Item> {
  return map((arr: T) => arr[0] as Item);
}

export function distinctUntilArrayItemChanged<T>(): MonoTypeOperatorFunction<
  T[]
> {
  return distinctUntilChanged((prevCollection: T[], currentCollection: T[]) => {
    if (prevCollection === currentCollection) {
      return true;
    }

    if (prevCollection.length !== currentCollection.length) {
      return false;
    }

    const isOneOfItemReferenceChanged = currentCollection.some((item, i) => {
      return prevCollection[i] !== item;
    });

    // return false means there is a change and we want to call next()
    return !isOneOfItemReferenceChanged;
  });
}

export const asap = <T>(): MonoTypeOperatorFunction<T> =>
  debounceTime(0, asapScheduler);

export function filterNil<T>(): OperatorFunction<T, NonNullable<T>> {
  return filter(
    (value: T): value is NonNullable<T> => value !== null && value !== undefined
  );
}

export function ofType<T extends Action<IdType>, IdType>(
  action: EntityActions
): OperatorFunction<T, T['ids']>;
export function ofType<T extends Action<IdType>, IdType>(
  actions: EntityActions[]
): MonoTypeOperatorFunction<T>;
export function ofType(...actions: any[]): any {
  return pipe(
    filter(({ type, ids }) => coerceArray(actions).includes(type)),
    map((action) => (Array.isArray(actions) ? action : action.ids))
  );
}
