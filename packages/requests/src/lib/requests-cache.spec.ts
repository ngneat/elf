import { createState, Store } from '@ngneat/elf';
import {
  getRequestCache,
  isRequestCached,
  selectIsRequestCached,
  selectRequestCache,
  skipWhileCached,
  updateRequestsCache,
  withRequestsCache,
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

    expect(spy).toHaveBeenCalledWith('none');

    expect(store.query(getRequestCache(requestKey))).toBe('none');

    store.reduce(
      updateRequestsCache({
        [requestKey]: 'partial',
      })
    );
    expect(store.query(getRequestCache(requestKey))).toBe('partial');
    expect(spy).toHaveBeenCalledWith('partial');

    store.reduce(
      updateRequestsCache({
        bar: 'partial',
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
      store.query(isRequestCached(requestKey, { type: 'partial' }))
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
        bar: 'full',
      })
    );

    spy = jest.fn();

    subject.asObservable().pipe(skipWhileCached(store, 'bar')).subscribe(spy);

    subject.next({});
    expect(spy).toHaveBeenCalledTimes(0);
  });
});
