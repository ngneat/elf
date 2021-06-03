import {
  BaseEntityOptions,
  defaultEntitiesRef,
  DefaultEntitiesRef,
  EntitiesRecord,
  EntitiesRef,
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

export function selectAll<
  S extends EntitiesRecord,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(
  options: BaseEntityOptions<Ref> = {}
): OperatorFunction<S, getEntityType<S, Ref>[]> {
  const { ref = defaultEntitiesRef } = options;
  const { entitiesKey, idsKey } = ref;

  return pipe(
    untilEntitiesChanges(entitiesKey),
    map((state) =>
      state[idsKey].map((id: getIdType<S, Ref>) => state[entitiesKey][id])
    )
  );
}
