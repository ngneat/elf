import {
  EntitiesRef,
  EntitiesState,
  getEntityType,
  getIdType,
  ItemPredicate,
} from './entity.state';
import { coerceArray } from '@ngneat/elf';

export function buildEntities<
  S extends EntitiesState<Ref>,
  Ref extends EntitiesRef
>(
  entities: getEntityType<S, Ref>[],
  idKey: string
): { ids: getIdType<S, Ref>[]; asObject: getEntityType<S, Ref> } {
  const asObject = {} as Record<getIdType<S, Ref>, getEntityType<S, Ref>>;
  const ids = [] as getIdType<S, Ref>;

  for (const entity of coerceArray(entities)) {
    const id: getIdType<S, Ref> = entity[idKey];

    ids.push(id);
    asObject[id] = entity;
  }

  return {
    ids,
    asObject,
  } as unknown as {
    ids: getIdType<S, Ref>[];
    asObject: getEntityType<S, Ref>;
  };
}

export function findIdsByPredicate<
  S extends EntitiesState<Ref>,
  Ref extends EntitiesRef
>(state: S, ref: Ref, predicate: ItemPredicate<getEntityType<S, Ref>>) {
  const { idsKey, entitiesKey } = ref;

  const entities = state[entitiesKey];
  return state[idsKey].filter((id: getIdType<S, Ref>) =>
    predicate(entities[id])
  );
}
