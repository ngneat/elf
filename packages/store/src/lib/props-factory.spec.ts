import { take } from 'rxjs/operators';

import { createState } from './state';
import { Store } from './store';
import { propsFactory } from './props-factory';
import {
  arrayAdd,
  arrayRemove,
  arrayToggle,
  arrayUpdate,
  inArray,
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
    store.update(updateRequestsStatus({ 1: 'success' }));
    expect(store.getValue()).toEqual({
      requestsStatus: { 1: 'success' },
    });
  });

  it('should update by callback', () => {
    store.update(
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
    store.update(setRequestsStatus({ 10: 'success' }));
    expect(store.getValue()).toEqual({ requestsStatus: { 10: 'success' } });
  });

  it('should set by callback', () => {
    store.update(
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
    store.update(resetRequestsStatus());
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

    store.update(setRequestsStatus((state) => state.requestsStatus));

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
    store.update(setVersion('2'));
    store.update(setVersion(2));

    store.update(
      // @ts-expect-error - Should be number
      setVersion(() => {
        return '1';
      })
    );

    store.update(
      setVersion((state) => {
        expectTypeOf(state).toEqualTypeOf<{ version: number }>();
        return 2;
      })
    );

    store.pipe(selectVersion()).subscribe((v) => {
      expectTypeOf(v).toEqualTypeOf<number>();
    });

    // @ts-expect-error - Should be number
    store.update(updateVersion('1'));
    store.update(updateVersion(1));

    store.update(
      // @ts-expect-error - Should be number
      updateVersion(() => {
        return '1';
      })
    );

    store.update(
      updateVersion((state) => {
        expectTypeOf(state).toEqualTypeOf<{ version: number }>();
        return 2;
      })
    );

    store.update(resetVersion());
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

    store.update(setActiveIds([1]));

    expect(store.getValue()).toEqual({ activeIds: [1] });

    store.update(addActiveIds(2));

    expect(store.getValue()).toEqual({ activeIds: [1, 2] });

    store.update(removeActiveIds(1));

    expect(store.getValue()).toEqual({ activeIds: [2] });

    store.update(toggleActiveIds(2));

    expect(store.getValue()).toEqual({ activeIds: [] });

    store.update(toggleActiveIds(3));

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
      inSkills,
    } = propsArrayFactory('skills', { initialValue: [] as string[] });

    const { state, config } = createState(withSkills());

    expectTypeOf(state).toEqualTypeOf<{ skills: string[] }>();

    const store = new Store({ state, config, name: '' });

    expectTypeOf(store.query(getSkills)).toEqualTypeOf<string[]>();

    // @ts-expect-error - Should be a string
    store.update(addSkills(1));
    store.update(addSkills('1'));

    expect(store.query(inSkills('1'))).toEqual(true);
    expect(store.query(inSkills('4'))).toEqual(false);

    // @ts-expect-error - Should be a string
    store.update(toggleSkills(1));
    store.update(toggleSkills('1'));

    // @ts-expect-error - Should be a string
    store.update(removeSkills(1));
    store.update(removeSkills('1'));

    // @ts-expect-error - Should be a string
    store.update(setSkills([1]));
    store.update(setSkills(['1']));

    // @ts-expect-error - Should not use the base
    store.update(updateSkills([1]));

    store.update(updateSkills('1', '2'));

    store.update(resetSkills());

    store.pipe(selectSkills()).subscribe((v) => {
      expectTypeOf(v).toEqualTypeOf<string[]>();
    });
  });
});

describe('Arrays', () => {
  it('should add', () => {
    expect(arrayAdd([1], 2)).toEqual([1, 2]);
    expect(arrayAdd([1], [2, 3])).toEqual([1, 2, 3]);
  });

  it('should remove', () => {
    expect(arrayRemove([1, 2, 3], 2)).toEqual([1, 3]);
    expect(arrayRemove([1, 2, 3, 4], [3, 4])).toEqual([1, 2]);
  });

  it('should toggle', () => {
    const toggled = arrayToggle([1, 2, 3], 4);
    expect(toggled).toEqual([1, 2, 3, 4]);

    expect(arrayToggle(toggled, 4)).toEqual([1, 2, 3]);
  });

  it('should check inArray', () => {
    expect(inArray([] as number[], 1)).toBeFalsy();
    expect(inArray([1], 1)).toBeTruthy();
  });

  expect(arrayUpdate([1, 2, 3], 1, 2)).toMatchInlineSnapshot(`
  Array [
    2,
    2,
    3,
  ]
`);
});
