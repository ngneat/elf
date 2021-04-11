import { OperatorFunction, pipe } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

export function select<T, R>(mapFn: (state: T) => R): OperatorFunction<T, R> {
  return pipe(
    map(mapFn),
    distinctUntilChanged()
  );
}

export function head<
  T extends any[],
  Item = T extends (infer I)[] ? I : never
  >(): OperatorFunction<T, Item> {
  return map((arr: T) => arr[0] as Item);
}
