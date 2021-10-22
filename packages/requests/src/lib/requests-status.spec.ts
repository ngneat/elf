import { createState, Store } from '@ngneat/elf';
import { expectTypeOf } from 'expect-type';
import { mapTo, tap, timer } from 'rxjs';
import {
  createRequestStatusOperator,
  initializeAsIdle,
  StatusState,
  updateRequestStatus,
} from '..';
import {
  getRequestStatus,
  selectIsRequestPending,
  selectRequestStatus,
  withRequestsStatus,
} from './requests-status';

describe('requestsStatus', () => {
  const { state, config } = createState(
    withRequestsStatus<'users' | `user-${string}`>()
  );

  const store = new Store({ state, config, name: 'users' });

  it('should work', () => {
    const spy = jest.fn();

    store.pipe(selectRequestStatus('users')).subscribe((v) => {
      expectTypeOf(v).toEqualTypeOf<StatusState>();
      spy(v);
    });

    expect(spy).toHaveBeenCalledWith({ value: 'pending' });

    expect(store.query(getRequestStatus('users'))).toStrictEqual({
      value: 'pending',
    });

    store.update(updateRequestStatus('users', 'success'));

    expect(store.query(getRequestStatus('users'))).toStrictEqual({
      value: 'success',
    });

    expect(spy).toHaveBeenCalledWith({ value: 'success' });

    store.update(updateRequestStatus('user-1', 'success'));

    // Updating a different key should not cause emission
    expect(spy).toHaveBeenCalledTimes(2);

    store.pipe(selectIsRequestPending('users')).subscribe((v) => {
      expectTypeOf(v).toEqualTypeOf<boolean>();
      expect(v).toBeFalsy();
    });
  });

  it('should set the error', () => {
    store.update(updateRequestStatus('users', 'error', { message: '' }));

    expect(store.query(getRequestStatus('users'))).toStrictEqual({
      value: 'error',
      error: { message: '' },
    });
  });

  it('should infer', () => {
    const { state, config } = createState(withRequestsStatus<'users'>());
    const store = new Store({ state, config, name: 'users' });

    store.update(updateRequestStatus('users', 'success'));

    // @ts-expect-error - Not valid key
    store.update(updateRequestStatus('nope', 'success'));

    // @ts-expect-error - Not valid status
    store.update(updateRequestStatus('users', 'foo'));
    // @ts-expect-error - Should pass the error as third param
    store.update(updateRequestStatus('users', 'error'));
  });

  it('should initializeAsIdle', () => {
    const { state, config } = createState(
      withRequestsStatus(initializeAsIdle(['foo', 'bar']))
    );
    const store = new Store({ state, config, name: 'users' });

    expect(store.query(getRequestStatus('bar'))).toEqual({ value: 'idle' });
    expect(store.query(getRequestStatus('foo'))).toEqual({ value: 'idle' });
    expect(store.query(getRequestStatus('baz'))).toEqual({ value: 'pending' });
  });

  it('should createRequestStatusOperator', () => {
    jest.useFakeTimers();

    const { state, config } = createState(
      withRequestsStatus<'users' | `user-${string}`>()
    );

    const store = new Store({ state, config, name: 'users' });

    const trackUsersRequestsStatus = createRequestStatusOperator(store);

    const spy = jest.fn();

    store.pipe(selectRequestStatus('users')).subscribe((v) => {
      console.log(v);
      spy(v);
    });

    expect(spy).toHaveBeenCalledTimes(1);

    timer(1000)
      .pipe(
        mapTo({ id: 1 }),
        trackUsersRequestsStatus('users', { handleSuccess: true }),
        tap((v) => {
          // check that we persists the return type
          expectTypeOf(v).toEqualTypeOf<{ id: number }>();
        })
      )
      .subscribe();

    jest.runAllTimers();
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
