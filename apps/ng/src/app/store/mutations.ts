import { Reducer } from '@ngneat/elf';
import { produce } from 'immer';

export function write<S>(updater: (state: S) => void): Reducer<S> {
  return function (state) {
    return produce(state, (draft) => {
      updater(draft as S);
    });
  };
}
