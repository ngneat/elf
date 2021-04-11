import { OperatorFunction } from 'rxjs';
import { select } from '../core/queries';
import { isString, isUndefined } from '../core/utils';
import { EntityState, getEntityType, getIdType, Project } from './entity.state';


/**
 *
 * Select an entity or a slice of an entity
 *
 * @example
 *
 * store.pipe(selectEntity(1))
 *
 */
export function selectEntity<T extends EntityState>(id: getIdType<T>): OperatorFunction<T, getEntityType<T> | undefined>;
/**
 * @example
 *
 * store.pipe(selectEntity(1, 'key'))
 *
 */
export function selectEntity<T extends EntityState, K extends keyof getEntityType<T>>(id: getIdType<T>, key: K): OperatorFunction<T, getEntityType<T>[K] | undefined>;
/**
 * @example
 *
 * store.pipe(selectEntity(1, entity => entity.title))
 *
 */
export function selectEntity<T extends EntityState, R>(id: getIdType<T>, project: Project<getEntityType<T>, R>): OperatorFunction<T, R>;

export function selectEntity<T extends EntityState, R>(id: any, projectOrKey?: any): any {
  return select<T, R>(state => getEntity(state.$entities, id, projectOrKey));
}

export function getEntity(
  entities: EntityState['$entities'],
  id: string | number,
  projectOrKey: Project<any, any> | string
) {
  const entity = entities[id];

  if(isUndefined(entity)) {
    return undefined;
  }

  if(!projectOrKey) {
    return entity;
  }

  if(isString(projectOrKey)) {
    return entity[projectOrKey];
  }

  return projectOrKey(entity);
}
