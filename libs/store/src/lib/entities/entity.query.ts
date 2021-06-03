import { OperatorFunction } from 'rxjs';
import { select } from '../core/queries';
import { isString, isUndefined } from '../core/utils';
import { BaseEntityOptions, defaultEntitiesRef, DefaultEntitiesRef, EntitiesRecord, EntitiesRef, getEntityType, getIdType } from './entity.state';

interface Options extends BaseEntityOptions<any> {
  pluck?: string | ((entity: unknown) => any);
}

/**
 * Select entity from the store
 *
 * @example
 *
 * store.pipe(selectEntity(id, { pluck: 'title' })
 *
 */
export function selectEntity<S extends EntitiesRecord, K extends keyof getEntityType<S, Ref>, Ref extends EntitiesRef = DefaultEntitiesRef>(
  id: getIdType<S, Ref>,
  options: { pluck: K } & BaseEntityOptions<Ref>
): OperatorFunction<S, getEntityType<S, Ref>[K]>;

/**
 * Select entity from the store
 *
 * @example
 *
 * store.pipe(selectEntity(id, { pluck: e => e.title })
 *
 */
export function selectEntity<S extends EntitiesRecord, R, Ref extends EntitiesRef = DefaultEntitiesRef>(
  id: getIdType<S, Ref>,
  options: { pluck: (entity: getEntityType<S, Ref>) => R } & BaseEntityOptions<Ref>
): OperatorFunction<S, R>;

/**
 * Select entity from the store
 *
 * @example
 *
 * store.pipe(selectEntity(id)
 *
 */
export function selectEntity<S extends EntitiesRecord, Ref extends EntitiesRef = DefaultEntitiesRef>(
  id: getIdType<S, Ref>,
  options?: BaseEntityOptions<Ref>
): OperatorFunction<S, getEntityType<S, Ref>>;

export function selectEntity<S extends EntitiesRecord, R>(id: any, options: Options = {}) {
  const { ref: { entitiesKey, pluck } = defaultEntitiesRef } = options;

  return select<S, R>(state => getEntity(state[entitiesKey], id, pluck));
}

export function getEntity(
  entities: EntitiesRecord,
  id: string | number,
  pluck: Options['pluck']
) {
  const entity = entities[id];

  if(isUndefined(entity)) {
    return undefined;
  }

  if(!pluck) {
    return entity;
  }

  if(isString(pluck)) {
    return entity[pluck];
  }

  return pluck(entity);
}
