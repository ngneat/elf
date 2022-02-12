import { Store, StoreValue } from '@ngneat/elf';
import { map } from 'rxjs/operators';
import { OperatorFunction, pipe } from 'rxjs';

export function excludeKeys<S extends Store, State extends StoreValue<S>>(
  keys: Array<keyof State>
): OperatorFunction<State, Partial<State>> {
  return pipe(
    map((state) => {
      return Object.keys(state).reduce<State>((toSave, key) => {
        if (!keys.includes(key)) {
          toSave[key] = state[key];
        }

        return toSave;
      }, {} as State);
    })
  );
}
