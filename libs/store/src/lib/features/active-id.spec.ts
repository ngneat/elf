import { createState, Store } from '../core';
import { addEntities, updateEntities, withEntities } from '../entities';
import { selectActiveEntity, setActiveId, withActiveId } from './active-id';

describe('activeId', () => {
  it('should select the active entity', () => {
    const { state, config } = createState(
      withEntities<{ id: number; title: string }, number>(),
      withActiveId()
    );

    const store = new Store({ state, config, name: '' });

    const spy = jest.fn();
    store.pipe(selectActiveEntity()).subscribe(spy);
    expect(spy).toHaveBeenCalledWith(undefined);

    store.reduce(addEntities({ id: 1, title: '' }));

    store.reduce(setActiveId(1));
    expect(spy).toHaveBeenCalledWith({ id: 1, title: '' });

    store.reduce(addEntities({ id: 2, title: '' }));
    expect(spy).toHaveBeenCalledTimes(2);

    store.reduce(updateEntities(1, { title: 'foo' }));
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenCalledWith({ id: 1, title: 'foo' });
  });
});
