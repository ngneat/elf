import { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

export function unionEntities<
  T extends {
    entities: Record<string, any>[];
    UIEntities: Record<string | number, Record<string, any>>;
  }
>(
  idKey: keyof T['entities'][0] = 'id'
): OperatorFunction<T, Array<T['entities'][0] & T['UIEntities'][0]>> {
  return map((state: T) => {
    return state.entities.map((entity) => {
      return {
        ...entity,
        ...state.UIEntities[entity[idKey as string]],
      };
    });
  });
}
