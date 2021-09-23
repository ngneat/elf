import { take } from 'rxjs/operators';

import { createState } from './state';
import { Store } from './store';
import { propsFactory } from './props-factory';
import {
  arrayAdd,
  arrayRemove,
  arrayToggle,
  propsArrayFactory,
} from './props-array-factory';
import { expectTypeOf } from 'expect-type';

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
    expect(store.getValue()).toEqual({ requestsStatus: {} });
  });

  it('should update', () => {
    store.reduce(updateRequestsStatus({ 1: 'success' }));
    expect(store.getValue()).toEqual({
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

    expect(store.getValue()).toEqual({
      requestsStatus: { 1: 'success', 2: 'error' },
    });
  });

  it('should set', () => {
    store.reduce(setRequestsStatus({ 10: 'success' }));
    expect(store.getValue()).toEqual({ requestsStatus: { 10: 'success' } });
  });

  it('should set by callback', () => {
    store.reduce(
      setRequestsStatus((state) => ({
        ...state.requestsStatus,
        2: 'success',
      }))
    );
    expect(store.getValue()).toEqual({
      requestsStatus: { 10: 'success', 2: 'success' },
    });
  });

  it('should reset', () => {
    store.reduce(resetRequestsStatus());
    expect(store.getValue()).toEqual({ requestsStatus: {} });
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

describe('propsFactory Types', () => {
  it('should work', () => {
    const {
      getVersion,
      resetVersion,
      selectVersion,
      setVersion,
      updateVersion,
      withVersion,
    } = propsFactory('version', { initialValue: 1 });

    const { state, config } = createState(withVersion());

    expectTypeOf(state).toEqualTypeOf<{ version: number }>();

    const store = new Store({ state, config, name: '' });

    const version = store.query(getVersion);
    expectTypeOf(version).toEqualTypeOf<number>();

    // @ts-expect-error - Should be number
    store.reduce(setVersion('2'));
    store.reduce(setVersion(2));

    store.reduce(
      // @ts-expect-error - Should be number
      setVersion(() => {
        return '1';
      })
    );

    store.reduce(
      setVersion((state) => {
        expectTypeOf(state).toEqualTypeOf<{ version: number }>();
        return 2;
      })
    );

    store.pipe(selectVersion()).subscribe((v) => {
      expectTypeOf(v).toEqualTypeOf<number>();
    });

    // @ts-expect-error - Should be number
    store.reduce(updateVersion('1'));
    store.reduce(updateVersion(1));

    store.reduce(
      // @ts-expect-error - Should be number
      updateVersion(() => {
        return '1';
      })
    );

    store.reduce(
      updateVersion((state) => {
        expectTypeOf(state).toEqualTypeOf<{ version: number }>();
        return 2;
      })
    );

    store.reduce(resetVersion());
  });
});

describe('stateArrayFactory', () => {
  it('should work', () => {
    const {
      setActiveIds,
      withActiveIds,
      toggleActiveIds,
      removeActiveIds,
      addActiveIds,
    } = propsArrayFactory('activeIds', { initialValue: [] as any[] });

    const { state, config } = createState(withActiveIds());

    const store = new Store({ state, config, name: '' });

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

describe('stateArrayFactory Types', () => {
  it('should work', () => {
    const {
      withSkills,
      addSkills,
      removeSkills,
      toggleSkills,
      updateSkills,
      getSkills,
      resetSkills,
      selectSkills,
      setSkills,
    } = propsArrayFactory('skills', { initialValue: [] as string[] });

    const { state, config } = createState(withSkills());

    expectTypeOf(state).toEqualTypeOf<{ skills: string[] }>();

    const store = new Store({ state, config, name: '' });

    expectTypeOf(store.query(getSkills)).toEqualTypeOf<string[]>();

    // @ts-expect-error - Should be a string
    store.reduce(addSkills(1));
    store.reduce(addSkills('1'));

    // @ts-expect-error - Should be a string
    store.reduce(toggleSkills(1));
    store.reduce(toggleSkills('1'));

    // @ts-expect-error - Should be a string
    store.reduce(removeSkills(1));
    store.reduce(removeSkills('1'));

    // @ts-expect-error - Should be a string
    store.reduce(setSkills([1]));
    store.reduce(setSkills(['1']));

    // @ts-expect-error - Should be a string
    store.reduce(updateSkills([1]));
    store.reduce(updateSkills(['1']));

    store.reduce(resetSkills());

    store.pipe(selectSkills()).subscribe((v) => {
      expectTypeOf(v).toEqualTypeOf<string[]>();
    });
  });
});

describe('Arrays', () => {
  describe('add', () => {
    it('should add', () => {
      const arr = [1];
      expect(arrayAdd(arr, 2)).toEqual([1, 2]);
    });
  });

  describe('remove', () => {
    it('should remove', () => {
      const arr = [1, 2, 3];
      expect(arrayRemove(arr, 2)).toEqual([1, 3]);
    });

    it('should remove by id', () => {
      const arr = [{ id: 1 }, { id: 2 }, { id: 3 }];
      expect(arrayRemove(arr, 1)).toEqual([{ id: 2 }, { id: 3 }]);
    });

    it('should remove by id with a different key', () => {
      const arr = [{ _id: 1 }, { _id: 2 }, { _id: 3 }];
      expect(arrayRemove(arr, 1, { idKey: '_id' })).toEqual([
        { _id: 2 },
        { _id: 3 },
      ]);
    });
  });

  describe('toggle', () => {
    it('should toggle', () => {
      const arr = [1, 2, 3];
      const toggled = arrayToggle(arr, 4);

      expect(toggled).toEqual([1, 2, 3, 4]);

      expect(arrayToggle(toggled, 4)).toEqual([1, 2, 3]);
    });

    it('should toggle by id', () => {
      const arr = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const toggled = arrayToggle(arr, { id: 4 });
      expect(toggled).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);

      expect(arrayToggle(toggled, { id: 4 })).toEqual([
        { id: 1 },
        { id: 2 },
        { id: 3 },
      ]);
    });

    it('should remove by id with a different key', () => {
      const arr = [{ _id: 1 }, { _id: 2 }, { _id: 3 }];
      const toggled = arrayToggle(arr, { _id: 4 }, { idKey: '_id' });
      expect(toggled).toEqual([{ _id: 1 }, { _id: 2 }, { _id: 3 }, { _id: 4 }]);

      expect(arrayToggle(toggled, { _id: 4 }, { idKey: '_id' })).toEqual([
        { _id: 1 },
        { _id: 2 },
        { _id: 3 },
      ]);
    });
  });
});
