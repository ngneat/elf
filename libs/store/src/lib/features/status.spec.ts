import { createState, Store } from '../core';
import { addEntities, withEntities } from '../entities';
import { selectStatus, setStatus, withStatus } from './status';

describe('status', () => {
  it('should select status', () => {
    const { state, config } = createState(
      withEntities<{ id: number; title: string }>(),
      withStatus()
    );

    const store = new Store({ state, config, name: '' });

    const spy = jest.fn();
    store.pipe(selectStatus()).subscribe(spy);
    expect(spy).toHaveBeenCalledWith({ type: 'idle', error: null, requestCount: 0 });

    store.reduce(addEntities({ id: 1, title: '' }));

    store.reduce(setStatus({ type: 'pending', error: '', requestCount: 3 }));
    expect(spy).toHaveBeenCalledWith({ type: 'pending', error: '', requestCount: 3 });

    store.reduce(addEntities({ id: 2, title: '' }));
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
