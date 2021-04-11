import { MonoTypeOperatorFunction, OperatorFunction, pipe } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { EntityState, getEntityType, getIdType } from './entity.state';
import { select } from '../core/queries';
import { isUndefined } from '../core/utils';
import { getEntity } from './entity.query';

/**
 * Select multiple entities from the store
 *
 * @example
 *
 * store.pipe(selectMany([1,2,3]))
 *
 */
export function selectMany<S extends EntityState, IdType extends getIdType<S>>(ids: IdType[]): OperatorFunction<S, getEntityType<S>[]>;
/**
 *
 * store.pipe(selectMany([1,2], entity => entity.title))

 */
export function selectMany<S extends EntityState, IdType extends getIdType<S>, R>(ids: IdType[], project: (entity: getEntityType<S>) => R): OperatorFunction<S, R[]>;

export function selectMany<S extends EntityState>(ids: any[], project?: any): OperatorFunction<any, any[]> {
  return pipe(
    select<S, any>(state => state.$entities),
    map(entities => {
      if(!ids?.length) return [];

      const filtered = [];
      for(const id of ids) {
        const value = getEntity(entities, id, project);
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
