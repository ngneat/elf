import { createState, Store } from '@ngneat/elf';
import {
  getRequestCache,
  isRequestCached,
  selectIsRequestCached,
  selectRequestCache,
  skipWhileCached,
  updateRequestCache,
  updateRequestsCache,
  withRequestsCache
} from './requests-cache';
import { Subject } from 'rxjs';

describe('requestsCache', () => {
  const { state, config } = createState(withRequestsCache());
  const store = new Store({ state, config, name: '' });
  const requestKey = 'foo';

  it('should work', () => {
    const spy = jest.fn();

    store.pipe(selectRequestCache(requestKey)).subscribe((v) => {
      spy(v);
    });

    expect(spy).toHaveBeenCalledWith({
      value: 'none',
    });

    expect(store.query(getRequestCache(requestKey))).toStrictEqual({
      value: 'none',
    });

    store.reduce(
      updateRequestsCache({
        [requestKey]: {
          value: 'partial',
        },
      })
    );
    expect(store.query(getRequestCache(requestKey))).toStrictEqual({
      value: 'partial',
    });
    expect(spy).toHaveBeenCalledWith({
      value: 'partial',
    });

    store.reduce(
      updateRequestsCache({
        bar: {
          value: 'partial',
        },
      })
    );

    // Updating a different key should not cause emission
    expect(spy).toHaveBeenCalledTimes(2);

    store.pipe(selectIsRequestCached(requestKey)).subscribe((v) => {
      expect(v).toBeTruthy();
    });

    // It's partial not full
    expect(store.query(isRequestCached(requestKey))).toBeFalsy();
    expect(
      store.query(isRequestCached(requestKey, { value: 'partial' }))
    ).toBeTruthy();
  });

  it('should skipWhileCached', () => {
    let spy = jest.fn();

    const subject = new Subject();

    subject.asObservable().pipe(skipWhileCached(store, 'bar')).subscribe(spy);

    subject.next({});
    expect(spy).toHaveBeenCalledTimes(1);

    store.reduce(
      updateRequestsCache({
        bar: {
          value: 'full',
        },
      })
    );

    spy = jest.fn();

    subject.asObservable().pipe(skipWhileCached(store, 'bar')).subscribe(spy);

    subject.next({});
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should uphold ttl', () => {
    store.reduce(
      updateRequestCache(requestKey, 'full', 1000)
    );

    expect(
      store.query(isRequestCached(requestKey, { value: 'full' }))
    ).toBeTruthy();

    setTimeout(() => {
      console.log("Time's up -- stop!");
      expect(
        store.query(isRequestCached(requestKey, { value: 'full' }))
      ).toBeFalsy();
    }, 2000);
  });
});
