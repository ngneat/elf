import { CacheState } from './requests-cache';
import { StatusState } from './requests-status';

export function requestsStateForEntities<T extends any[]>(
  entities: T,
  options?: {
    idKey?: keyof T[0];
    cacheStatus?: CacheState;
    statusValue?: StatusState;
  }
) {
  const result = {
    cache: {} as Record<any, CacheState>,
    status: {} as Record<any, StatusState>,
  };

  const {
    idKey,
    cacheStatus,
    statusValue,
  }: { idKey: keyof T[0]; cacheStatus: CacheState; statusValue: StatusState } =
    {
      idKey: 'id',
      cacheStatus: 'full',
      statusValue: 'success',
      ...options,
    };

  for (const entity of entities) {
    result.cache[entity[idKey]] = cacheStatus;
    result.status[entity[idKey]] = statusValue;
  }

  return result;
}
