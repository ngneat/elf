import { MonoTypeOperatorFunction, OperatorFunction, pipe } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

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
