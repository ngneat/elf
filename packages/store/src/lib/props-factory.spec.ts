import { take } from 'rxjs/operators';

import { createState } from './state';
import { Store } from './store';
import { propsFactory } from './props-factory';
import { propsArrayFactory } from './props-array-factory';

type StatusValue = Record<string | number, StatusState>;
type StatusState = 'pending' | 'success' | 'error';

describe('propsFactory', () => {
  const {
    withRequestsStatus,
    updateRequestsStatus,
    selectRequestsStatus,
    resetRequestsStatus,
    getRequestsStatus,
    setRequestsStatus,
  } = propsFactory('requestsStatus', {
    initialValue: {} as StatusValue,
  });

  const { state, config } = createState(withRequestsStatus());
  const store = new Store({ state, config, name: '' });

  it('should work', () => {
    expect(store.state).toEqual({ requestsStatus: {} });
  });

  it('should update', () => {
    store.reduce(updateRequestsStatus({ 1: 'success' }));
    expect(store.state).toEqual({
      requestsStatus: { 1: 'success' },
    });
  });

  it('should update by callback', () => {
    store.reduce(
      updateRequestsStatus(() => {
        return {
          2: 'error',
        };
      })
    );

    expect(store.state).toEqual({
      requestsStatus: { 1: 'success', 2: 'error' },
    });
  });

  it('should set', () => {
    store.reduce(setRequestsStatus({ 10: 'success' }));
    expect(store.state).toEqual({ requestsStatus: { 10: 'success' } });
  });

  it('should set by callback', () => {
    store.reduce(
      setRequestsStatus((state) => ({
        ...state.requestsStatus,
        2: 'success',
      }))
    );
    expect(store.state).toEqual({
      requestsStatus: { 10: 'success', 2: 'success' },
    });
  });

  it('should reset', () => {
    store.reduce(resetRequestsStatus());
    expect(store.state).toEqual({ requestsStatus: {} });
  });

  it('should query', () => {
    expect(store.query(getRequestsStatus)).toEqual({});
  });

  it('should select', () => {
    store.pipe(selectRequestsStatus(), take(1)).subscribe((v) => {
      expect(v).toEqual({});
    });
  });

  it('should not emit if it returns the same value', () => {
    const spy = jest.fn();
    store.subscribe(spy);

    expect(spy).toHaveBeenCalledTimes(1);

    store.reduce(setRequestsStatus((state) => state.requestsStatus));

    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe('stateArrayFactory', () => {
  it('should work', () => {
    const {
      setActiveIds,
      withActiveIds,
      selectActiveIds,
      toggleActiveIds,
      removeActiveIds,
      addActiveIds,
    } = propsArrayFactory('activeIds', { initialValue: [] as any[] });

    const { state, config } = createState(withActiveIds());

    const store = new Store({ state, config, name: '' });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    store.pipe(selectActiveIds()).subscribe((v) => {
      //
    });

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
