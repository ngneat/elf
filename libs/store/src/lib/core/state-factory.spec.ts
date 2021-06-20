import { createState, stateFactory, Store, withProps } from '@ngneat/elf';
import { stateArrayFactory } from './state-array-factory';

describe('stateFactory', () => {
  it('should work', () => {
    const { selectActiveId, setActiveId, withActiveId, resetActiveId } =
      stateFactory<{ activeId: number | undefined }>('activeId', undefined);

    const { state, config } = createState(
      withActiveId(),
      withProps<{ filter: string }>({ filter: '' })
    );

    const store = new Store({ state, config, name: '' });
    expect(store.getValue()).toEqual({ activeId: undefined, filter: '' });

    const spy = jest.fn();
    store.pipe(selectActiveId()).subscribe(spy);

    expect(spy).toHaveBeenCalledWith(undefined);
    expect(spy).toHaveBeenCalledTimes(1);

    store.reduce(setActiveId(1));
    expect(spy).toHaveBeenCalledTimes(2);
    expect(store.getValue()).toEqual({ activeId: 1, filter: '' });

    store.reduce((state) => ({
      ...state,
      filter: 'foo',
    }));
    expect(spy).toHaveBeenCalledTimes(2);

    store.reduce(resetActiveId());
    expect(spy).toHaveBeenCalledTimes(3);
    expect(store.getValue()).toEqual({ activeId: undefined, filter: 'foo' });
  });
});

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
