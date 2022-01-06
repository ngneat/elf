import { isFunction } from '@ngneat/elf';
import {
  DefaultEntitiesRef,
  EntitiesRef,
  EntitiesState,
  getEntityType,
  getIdType,
  ItemPredicate,
} from './entity.state';

export function buildEntities<
  S extends EntitiesState<Ref>,
  Ref extends EntitiesRef
>(
  entities: getEntityType<S, Ref>[],
  idKey: string
): { ids: getIdType<S, Ref>[]; asObject: getEntityType<S, Ref> } {
  const asObject = {} as Record<getIdType<S, Ref>, getEntityType<S, Ref>>;
  const ids = [] as getIdType<S, Ref>;

  for (const entity of entities) {
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

export function findEntityByPredicate<
  S extends EntitiesState<Ref>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(state: S, ref: EntitiesRef, predicate: ItemPredicate<getEntityType<S, Ref>>) {
  const { idsKey, entitiesKey } = ref;

  const entities = state[entitiesKey];
  const id = state[idsKey].find((id: getIdType<S, Ref>) => {
    return predicate(entities[id]);
  });

  return entities[id];
}

export function checkPluck<
  S extends EntitiesState<Ref>,
  R extends getEntityType<S, Ref>[],
  K extends keyof getEntityType<S, Ref>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(
  entity: getEntityType<S, Ref>,
  pluck?: K | ((entity: getEntityType<S, Ref>) => R)
) {
  if (entity && pluck) {
    return isFunction(pluck) ? pluck(entity) : entity[pluck];
  } else {
    return entity;
  }
}
