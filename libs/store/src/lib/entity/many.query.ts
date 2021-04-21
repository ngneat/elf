import { MonoTypeOperatorFunction, OperatorFunction, pipe } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { BaseEntityOptions, defaultEntitiesRef, DefaultEntitiesRef, EntitiesRecord, EntitiesRef, getEntityType, getIdType } from './entity.state';
import { select } from '../core/queries';
import { isUndefined } from '../core/utils';
import { getEntity } from './entity.query';

interface Options extends BaseEntityOptions<any> {
  pluck?: string | ((entity: unknown) => any);
}

/**
 * Select multiple entities from the store
 *
 * @example
 *
 * store.pipe(selectMany([1,2,3], { pluck: 'title' })
 *
 */
export function selectMany<S extends EntitiesRecord, K extends keyof getEntityType<S, Ref>, Ref extends EntitiesRef = DefaultEntitiesRef>(
  ids: Array<getIdType<S, Ref>>,
  options: { pluck: K } & BaseEntityOptions<Ref>
): OperatorFunction<S, getEntityType<S, Ref>[K][]>;

/**
 * Select multiple entities from the store
 *
 * @example
 *
 * store.pipe(selectMany([1,2,3], { pluck: e => e.title })
 *
 */
export function selectMany<S extends EntitiesRecord, R, Ref extends EntitiesRef = DefaultEntitiesRef>(
  ids: Array<getIdType<S, Ref>>,
  options: { pluck: (entity: getEntityType<S, Ref>) => R } & BaseEntityOptions<Ref>
): OperatorFunction<S, R[]>;

/**
 * Select multiple entities from the store
 *
 * @example
 *
 * store.pipe(selectMany({ ids: [1,2,3] })
 *
 */
export function selectMany<S extends EntitiesRecord, Ref extends EntitiesRef = DefaultEntitiesRef>(
  ids: Array<getIdType<S, Ref>>,
  options?: BaseEntityOptions<Ref>
): OperatorFunction<S, getEntityType<S, Ref>[]>;

export function selectMany<S extends EntitiesRecord, R>(ids: any[], options: Options = {}): any {
  const { ref: { entitiesKey } = defaultEntitiesRef, pluck } = options;

  return pipe(
    select<S, R>(state => state[entitiesKey]),
    map(entities => {
      if(!ids.length) return [];

      const filtered = [];
      for(const id of ids) {
        const value = getEntity(entities, id, pluck);
        if(!isUndefined(value)) filtered.push(value);
      }

      return filtered;
    }),
    distinctUntilArrayItemChanged()
  );
}

function distinctUntilArrayItemChanged<T>(): MonoTypeOperatorFunction<T[]> {
  return distinctUntilChanged((prevCollection: T[], currentCollection: T[]) => {
    if(prevCollection === currentCollection) {
      return true;
    }

    if(prevCollection.length !== currentCollection.length) {
      return false;
    }

    const isOneOfItemReferenceChanged = hasChange(
      prevCollection,
      currentCollection
    );

    // return `false` means there is a change and we want to call `next()`
    return !isOneOfItemReferenceChanged;
  });
}

function hasChange<T>(first: T[], second: T[]) {
  const hasChange = second.some((currentItem) => {
    const oldItem = first.find((prevItem) => prevItem === currentItem);
    return oldItem === undefined;
  });

  return hasChange;
}
