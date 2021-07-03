import {
  BaseEntityOptions,
  defaultEntitiesRef,
  DefaultEntitiesRef,
  EntitiesRecord,
  EntitiesRef,
  EntitiesState,
  getEntityType,
  getIdType,
} from './entity.state';
import { MonoTypeOperatorFunction, OperatorFunction, pipe } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

export function untilEntitiesChanges<T extends EntitiesRecord>(
  key: string
): MonoTypeOperatorFunction<T> {
  return distinctUntilChanged((prev, current) => {
    return prev[key] === current[key];
  });
}

/**
 *
 * Observe entities
 *
 * @example
 *
 * store.pipe(selectAll())
 *
 * store.pipe(selectAll({ ref: entitiesUIRef }))
 *
 */
export function selectAll<
  S extends EntitiesState<Ref>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(
  options: BaseEntityOptions<Ref> = {}
): OperatorFunction<S, getEntityType<S, Ref>[]> {
  const { ref: { entitiesKey, idsKey } = defaultEntitiesRef } = options;

  return pipe(
    untilEntitiesChanges(entitiesKey),
    map((state) =>
      state[idsKey].map((id: getIdType<S, Ref>) => state[entitiesKey][id])
    )
  );
}
