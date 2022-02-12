import { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

export function unionEntitiesAsMap<
  T extends {
    entities: Record<string, any>[];
    UIEntities: Record<string | number, Record<string, any>>;
  },
  Idkey extends keyof T['entities'][0] = 'id'
>(
  idKey: Idkey = 'id' as Idkey
): OperatorFunction<
  T,
  Record<T['entities'][0][Idkey], T['entities'][0] & T['UIEntities'][0]>
> {
  return map((state: T) => {
    return Object.fromEntries(
      state.entities.map((entity) => {
        return [
          entity[idKey as string],
          {
            ...entity,
            ...state.UIEntities[entity[idKey as string]],
          },
        ];
      })
    );
  });
}
