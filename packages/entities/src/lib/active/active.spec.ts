import { createState, Store } from '@ngneat/elf';
import { addEntities, updateEntities, withEntities } from '../../index';
import {
  removeActiveIds,
  selectActiveEntities,
  selectActiveEntity,
  selectActiveId,
  setActiveId,
  setActiveIds,
  toggleActiveIds,
  withActiveId,
  withActiveIds,
} from './active';

describe('activeId', () => {
  it('should select the active entity', () => {
    const { state, config } = createState(
      withEntities<{ id: number; title: string }>(),
      withActiveId()
    );

    const store = new Store({ state, config, name: '' });

    const spy = jest.fn();
    store.pipe(selectActiveId()).subscribe(() => {
      //
    });

    store.pipe(selectActiveEntity()).subscribe((v) => {
      spy(v);
    });

    expect(spy).toHaveBeenCalledWith(undefined);

    store.update(addEntities({ id: 1, title: '' }));

    store.update(setActiveId(1));
    expect(spy).toHaveBeenCalledWith({ id: 1, title: '' });

    store.update(addEntities({ id: 2, title: '' }));
    expect(spy).toHaveBeenCalledTimes(2);

    store.update(updateEntities(1, { title: 'foo' }));
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenCalledWith({ id: 1, title: 'foo' });

    store.update(setActiveId(123));
    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy).toHaveBeenNthCalledWith(4, undefined);
  });
});

describe('activeIds', () => {
  it('should select the active entities', () => {
    const { state, config } = createState(
      withEntities<{ id: number; title: string }>(),
      withActiveIds()
    );

    const store = new Store({ state, config, name: '' });

    const spy = jest.fn();
    store.pipe(selectActiveEntities()).subscribe(spy);
    expect(spy).toHaveBeenCalledWith([]);

    store.update(addEntities({ id: 1, title: '' }));
    store.update(setActiveIds([1]));
    expect(spy).toHaveBeenCalledWith([{ id: 1, title: '' }]);

    store.update(addEntities({ id: 2, title: '' }));
    expect(spy).toHaveBeenCalledTimes(2);

    store.update(updateEntities(1, { title: 'foo' }));
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenCalledWith([{ id: 1, title: 'foo' }]);

    store.update(removeActiveIds(1));
    expect(spy).toHaveBeenCalledWith([]);

    store.update(addEntities({ id: 3, title: '3' }));
    store.update(toggleActiveIds(3));
    expect(spy).toHaveBeenCalledWith([{ id: 3, title: '3' }]);
  });
});
