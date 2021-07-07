import {createState, Store} from '../core';
import {withEntities} from '../entities';
import {deleteCacheEntry, inCache, resetCache, selectCache, selectInCache, updateCache, withCache} from "./cache";

describe('cache', () => {
  it('should work', () => {
    const { state, config } = createState(
      withEntities<{ id: number; title: string }>(),
      withCache()
    );

    const store = new Store({ state, config, name: '' });

    const spy = jest.fn();
    store.pipe(selectCache()).subscribe(spy);
    expect(spy).toHaveBeenCalledWith({});

    store.reduce(updateCache({ todos: 'full' }));

    expect(store.state).toMatchSnapshot('update');

    store.reduce(updateCache({ todo: 'partial' }));

    expect(store.state).toMatchSnapshot('update');

    store.reduce(resetCache());

    expect(store.state).toMatchSnapshot('reset');

    store.reduce(deleteCacheEntry('todo'));

    expect(store.state).toMatchSnapshot('delete todo cache');

    store.reduce(updateCache({ todos: 'full' }));

    expect(store.query(inCache('todos'))).toEqual(true);

    const selectHasCacheSpy = jest.fn();
    store.pipe(selectInCache('todos')).subscribe(selectHasCacheSpy);

    expect(selectHasCacheSpy).toHaveBeenCalledWith(true);

    store.reduce(deleteCacheEntry('todos'));

    expect(selectHasCacheSpy).toHaveBeenCalledWith(false);
  });
});
