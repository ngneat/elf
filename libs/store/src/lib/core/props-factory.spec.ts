import {
  addActiveIds,
  createState,
  getRequests,
  removeActiveIds,
  resetRequests,
  selectActiveIds,
  selectRequests,
  setActiveIds,
  setRequests,
  Store,
  toggleActiveIds,
  updateRequests,
  withActiveIds,
  withRequests,
} from '@ngneat/elf';
import { take } from 'rxjs/operators';

describe('propsFactory', () => {
  const { state, config } = createState(withRequests());
  const store = new Store({ state, config, name: '' });

  it('should work', () => {
    expect(store.state).toEqual({ requests: { cache: {}, status: {} } });
  });

  it('should update', () => {
    store.reduce(
      updateRequests({ cache: { 1: 'full' }, status: { 1: 'success' } })
    );
    expect(store.state).toEqual({
      requests: { cache: { 1: 'full' }, status: { 1: 'success' } },
    });
  });

  it('should update by callback', () => {
    store.reduce(
      updateRequests((state) => ({
        cache: {
          ...state.requests.cache,
          2: 'partial',
        },
      }))
    );
    expect(store.state).toEqual({
      requests: {
        cache: { 1: 'full', 2: 'partial' },
        status: { 1: 'success' },
      },
    });
  });

  it('should set', () => {
    store.reduce(
      setRequests({ cache: { 1: 'full' }, status: { 1: 'success' } })
    );
    expect(store.state).toEqual({
      requests: { cache: { 1: 'full' }, status: { 1: 'success' } },
    });
  });

  it('should set by callback', () => {
    store.reduce(
      setRequests((state) => ({
        status: {},
        cache: {
          ...state.requests.cache,
          2: 'partial',
        },
      }))
    );
    expect(store.state).toEqual({
      requests: { cache: { 1: 'full', 2: 'partial' }, status: {} },
    });
  });

  it('should reset', () => {
    store.reduce(resetRequests());
    expect(store.state).toEqual({ requests: { cache: {}, status: {} } });
  });

  it('should query', () => {
    expect(store.query(getRequests)).toEqual({ cache: {}, status: {} });
  });

  it('should select', () => {
    store.pipe(selectRequests(), take(1)).subscribe((v) => {
      expect(v).toEqual({ cache: {}, status: {} });
    });
  });

  it('should not emit if it returns the same value', () => {
    const spy = jest.fn();
    store.subscribe(spy);

    expect(spy).toHaveBeenCalledTimes(1);

    store.reduce(setRequests((state) => state.requests));

    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe('stateArrayFactory', () => {
  it('should work', () => {
    const { state, config } = createState(withActiveIds());

    const store = new Store({ state, config, name: '' });

    store.pipe(selectActiveIds()).subscribe(jest.fn());

    store.reduce(setActiveIds([1]));

    expect(store.state).toEqual({ activeIds: [1] });

    store.reduce(addActiveIds(2));

    expect(store.state).toEqual({ activeIds: [1, 2] });

    store.reduce(removeActiveIds(1));

    expect(store.state).toEqual({ activeIds: [2] });

    store.reduce(toggleActiveIds(2));

    expect(store.state).toEqual({ activeIds: [] });

    store.reduce(toggleActiveIds(3));

    expect(store.state).toEqual({ activeIds: [3] });
  });
});
