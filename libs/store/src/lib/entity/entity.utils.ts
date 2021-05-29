import { EntitiesRecord, EntitiesRef, getEntityType, getIdType } from './entity.state';
import { coerceArray } from '../core/utils';

export function buildEntities<S extends EntitiesRecord, Ref extends EntitiesRef>(ref: Ref, entities: getEntityType<S, Ref>[], idKey: string):
  { ids: getIdType<S, Ref>[], asObject: getEntityType<S, Ref> } {
  const asObject = {} as Record<getIdType<S, Ref>, getEntityType<S, Ref>>;
  const ids = [] as getIdType<S, Ref>;

  for(const entity of coerceArray(entities)) {
    const id: getIdType<S, Ref> = entity[idKey];

    ids.push(id);
    asObject[id] = entity;
  }

  return {
    ids,
   asObject
  } as unknown as { ids: getIdType<S, Ref>[], asObject: getEntityType<S, Ref> };
}
