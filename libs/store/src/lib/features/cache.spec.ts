import {createState, Store} from '../core';
import {addEntities, withEntities} from '../entities';
import {selectStatus, setStatus} from "./status";
import {selectCache, setCache, withCache} from "./cache";

describe('cache', () => {
  it('should select cache', () => {
    const {state, config} = createState(
      withEntities<{ id: number; title: string }, number>(),
      withCache()
    );

    const store = new Store({state, config, name: ''});

    const spy = jest.fn();
    store.pipe(selectCache()).subscribe(spy);
    expect(spy).toHaveBeenCalledWith('none');

    store.reduce(addEntities({id: 1, title: ''}));

    store.reduce(setCache('full'));
    expect(spy).toHaveBeenCalledWith('full');

    store.reduce(addEntities({id: 2, title: ''}));
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
