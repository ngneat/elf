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
import { coerceArray, isUndefined } from './utils';
import { EntityAction, EntityActions } from '../../../entities/src';

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

// TODO infer the IDType
type IDType = string | number;

export function ofTypes<T extends EntityAction<IDType>>(
  actionOrActions?: EntityActions | EntityActions[]
): OperatorFunction<T, IDType[] | EntityAction<IDType>> {
  if (isUndefined(actionOrActions)) {
    return map((action) => action);
  }

  const transform = Array.isArray(actionOrActions)
    ? (action: EntityAction<IDType>) => action
    : ({ ids }: EntityAction<IDType>) => ids;
  const actions = coerceArray(actionOrActions);

  return pipe(
    filter(({ type }) => actions.includes(type)),
    map((action) => transform(action))
  );
}
