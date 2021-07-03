import { createState, Store } from '../core';
import { addEntities, withEntities } from '../entities';
import {
  withCacheStatus,
  selectCacheStatus,
  setCacheStatus,
} from './cache-status';

describe('cache', () => {
  it('should select cache', () => {
    const { state, config } = createState(
      withEntities<{ id: number; title: string }>(),
      withCacheStatus()
    );

    const store = new Store({ state, config, name: '' });

    const spy = jest.fn();
    store.pipe(selectCacheStatus()).subscribe(spy);
    expect(spy).toHaveBeenCalledWith('none');

    store.reduce(addEntities({ id: 1, title: '' }));

    store.reduce(setCacheStatus('full'));
    expect(spy).toHaveBeenCalledWith('full');

    store.reduce(addEntities({ id: 2, title: '' }));
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
