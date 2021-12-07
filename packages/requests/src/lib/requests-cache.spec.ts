import { createState, Store } from '@ngneat/elf';
import {
  CacheState,
  clearRequestsCache,
  getRequestCache,
  isRequestCached,
  selectIsRequestCached,
  selectRequestCache,
  updateRequestCache,
  updateRequestsCache,
  withRequestsCache,
} from './requests-cache';
import { Subject } from 'rxjs';
import { expectTypeOf } from 'expect-type';
import { createRequestsCacheOperator } from '..';

describe('requestsCache', () => {
  const { state, config } = createState(
    withRequestsCache<'users' | `user-${string}`>()
  );
  const store = new Store({ state, config, name: 'users' });

  it('should work', () => {
    const spy = jest.fn();

    store.pipe(selectRequestCache('users')).subscribe((v) => {
      expectTypeOf(v).toEqualTypeOf<CacheState>();
      spy(v);
    });

    expect(spy).toHaveBeenCalledWith({
      value: 'none',
    });

    expect(store.query(getRequestCache('users'))).toStrictEqual({
      value: 'none',
    });

    store.update(updateRequestCache('users', { value: 'partial' }));

    expect(store.query(getRequestCache('users'))).toStrictEqual({
      value: 'partial',
    });

    expect(spy).toHaveBeenCalledWith({
      value: 'partial',
    });

    store.update(updateRequestCache('user-1', { value: 'partial' }));

    // // Updating a different key should not cause emission
    expect(spy).toHaveBeenCalledTimes(2);

    // It's partial not full
    store.pipe(selectIsRequestCached('users')).subscribe((v) => {
      expectTypeOf(v).toEqualTypeOf<boolean>();
      expect(v).toBeFalsy();
    });

    // It's partial not full
    expect(store.query(isRequestCached('users'))).toBeFalsy();
    expect(
      store.query(isRequestCached('users', { value: 'partial' }))
    ).toBeTruthy();
  });

  it('should updateRequestCache', () => {
    const { state, config } = createState(
      withRequestsCache<'users' | `user-${string}`>()
    );
    const store = new Store({ state, config, name: 'users' });
    const key = 'users';

    store.update(updateRequestCache(key));

    expect(store.query(isRequestCached(key))).toBeTruthy();

    store.update(updateRequestCache(key, { value: 'partial' }));
    expect(store.query(isRequestCached(key))).toBeFalsy();
    expect(
      store.query(isRequestCached(key, { value: 'partial' }))
    ).toBeTruthy();

    store.update(updateRequestCache(key, { value: 'none' }));
    expect(store.query(isRequestCached(key))).toBeFalsy();
    expect(store.query(isRequestCached(key, { value: 'partial' }))).toBeFalsy();
  });

  it('should skipWhileCached', () => {
    const { state, config } = createState(
      withRequestsCache<'users' | `user-${string}`>()
    );
    const store = new Store({ state, config, name: 'users' });
    const skipWhileUsersCached = createRequestsCacheOperator(store);

    let spy = jest.fn();

    const subject = new Subject();

    subject.asObservable().pipe(skipWhileUsersCached('users')).subscribe(spy);

    subject.next({});
    expect(spy).toHaveBeenCalledTimes(1);

    store.update(updateRequestCache('users', { value: 'full' }));

    spy = jest.fn();

    subject.asObservable().pipe(skipWhileUsersCached('users')).subscribe(spy);

    subject.next({});
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should uphold ttl', () => {
    const { state, config } = createState(
      withRequestsCache<'users' | `user-${string}`>()
    );
    const store = new Store({ state, config, name: 'users' });

    jest.useFakeTimers();
    const ttlRequestKey = 'users';

    store.update(updateRequestCache(ttlRequestKey, { ttl: 1000 }));

    expect(
      store.query(isRequestCached(ttlRequestKey, { value: 'full' }))
    ).toBeTruthy();

    jest.advanceTimersByTime(2000);

    expect(
      store.query(isRequestCached(ttlRequestKey, { value: 'full' }))
    ).toBeFalsy();

    store.update(updateRequestCache(ttlRequestKey, { ttl: 1000 }));

    expect(
      store.query(isRequestCached(ttlRequestKey, { value: 'full' }))
    ).toBeTruthy();

    jest.advanceTimersByTime(2000);

    expect(
      store.query(isRequestCached(ttlRequestKey, { value: 'full' }))
    ).toBeFalsy();

    jest.useRealTimers();
  });

  it('should clear all', () => {
    const { state, config } = createState(withRequestsCache());

    const store = new Store({ state, config, name: 'users' });

    store.update(updateRequestCache('todos'));

    expect(store.getValue()).toMatchInlineSnapshot(`
      Object {
        "requestsCache": Object {
          "todos": Object {
            "value": "full",
          },
        },
      }
    `);

    store.update(clearRequestsCache());

    expect(store.getValue()).toMatchInlineSnapshot(`
      Object {
        "requestsCache": Object {},
      }
    `);
  });
});

test('updateRequestsCache', () => {
  const { state, config } = createState(
    withRequestsCache<'foo' | 'bar' | 'baz'>()
  );

  const store = new Store({ state, config, name: 'users' });

  store.update(
    updateRequestsCache({
      foo: {
        value: 'partial',
      },
    })
  );

  expect(store.getValue()).toMatchSnapshot();

  store.update(
    updateRequestsCache({
      foo: {
        value: 'full',
      },
      bar: {
        value: 'full',
      },
    })
  );

  expect(store.getValue()).toMatchSnapshot();

  store.update(updateRequestsCache(['foo', 'bar'], { value: 'partial' }));

  expect(store.getValue()).toMatchSnapshot();
});
