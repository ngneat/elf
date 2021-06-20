import { createState, Store } from '@ngneat/elf';
import { stateArrayFactory } from './state-array-factory';

describe('stateArrayFactory', () => {
  it('should work', () => {
    const {
      selectActiveIds,
      setActiveIds,
      withActiveIds,
      addActiveIds,
      removeActiveIds,
      toggleActiveIds,
    } = stateArrayFactory<{ activeIds: number[] }>('activeIds', []);

    const { state, config } = createState(withActiveIds());

    const store = new Store({ state, config, name: '' });

    store.pipe(selectActiveIds()).subscribe(jest.fn());

    store.reduce(setActiveIds([1]));

    expect(store.getValue()).toEqual({ activeIds: [1] });

    store.reduce(addActiveIds(2));

    expect(store.getValue()).toEqual({ activeIds: [1, 2] });

    store.reduce(removeActiveIds(1));

    expect(store.getValue()).toEqual({ activeIds: [2] });

    store.reduce(toggleActiveIds(2));

    expect(store.getValue()).toEqual({ activeIds: [] });

    store.reduce(toggleActiveIds(3));

    expect(store.getValue()).toEqual({ activeIds: [3] });
  });
});
