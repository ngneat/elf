import { createState, Store } from '@ngneat/elf';
import {
  addActiveIds,
  addEntities,
  entitiesPropsFactory,
  getActiveEntities,
  getActiveEntity,
  updateEntities,
  withEntities,
} from '../../index';
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
import { expectTypeOf } from 'expect-type';

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

  it('should get the active entity', () => {
    const { state, config } = createState(
      withEntities<{ id: number; title: string }>(),
      withActiveId()
    );

    const store = new Store({ state, config, name: '' });

    expect(store.query(getActiveEntity())).toBeUndefined();

    store.update(addEntities({ id: 1, title: '' }));

    expect(store.query(getActiveEntity())).toBeUndefined();

    store.update(setActiveId(1));

    expect(store.query(getActiveEntity())).toEqual({ id: 1, title: '' });
    expectTypeOf(store.query(getActiveEntity())).toEqualTypeOf<
      { id: number; title: string } | undefined
    >();

    store.update(addEntities({ id: 2, title: '' }));

    expect(store.query(getActiveEntity())).toEqual({ id: 1, title: '' });

    store.update(setActiveId(2));

    expect(store.query(getActiveEntity())).toEqual({ id: 2, title: '' });

    store.update(setActiveId(967));

    expect(store.query(getActiveEntity())).toBeUndefined();
  });

  it('should get active entity from ref', () => {
    const { personEntitiesRef, withPersonEntities } =
      entitiesPropsFactory('person');

    const { state, config } = createState(
      withPersonEntities<{ id: number; name: string }>(),
      withActiveId()
    );

    const store = new Store({ state, config, name: '' });

    expect(
      store.query(getActiveEntity({ ref: personEntitiesRef }))
    ).toBeUndefined();

    store.update(addEntities({ id: 1, name: '' }, { ref: personEntitiesRef }));
    store.update(setActiveId(1));

    const activeRefEntity = store.query(
      getActiveEntity({ ref: personEntitiesRef })
    );

    expect(activeRefEntity).toEqual({ id: 1, name: '' });
    expectTypeOf(activeRefEntity).toEqualTypeOf<
      { id: number; name: string } | undefined
    >();
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

  it('should get the active entities', () => {
    const { state, config } = createState(
      withEntities<{ id: number; title: string }>(),
      withActiveIds()
    );

    const store = new Store({ state, config, name: '' });

    expect(store.query(getActiveEntities())).toEqual([]);

    store.update(addEntities({ id: 1, title: '' }));

    expect(store.query(getActiveEntities())).toEqual([]);

    store.update(addActiveIds(1));

    expect(store.query(getActiveEntities())).toEqual([{ id: 1, title: '' }]);
    expectTypeOf(store.query(getActiveEntities())).toEqualTypeOf<
      { id: number; title: string }[]
    >();

    store.update(addEntities({ id: 2, title: '' }));

    expect(store.query(getActiveEntities())).toEqual([{ id: 1, title: '' }]);

    store.update(addActiveIds(2));

    expect(store.query(getActiveEntities())).toEqual([
      { id: 1, title: '' },
      { id: 2, title: '' },
    ]);

    store.update(addActiveIds(967));

    expect(store.query(getActiveEntities())).toEqual([
      { id: 1, title: '' },
      { id: 2, title: '' },
    ]);

    store.update(setActiveIds([]));

    expect(store.query(getActiveEntities())).toEqual([]);
  });

  it('should get active entities from ref', () => {
    const { personEntitiesRef, withPersonEntities } =
      entitiesPropsFactory('person');

    const { state, config } = createState(
      withPersonEntities<{ id: number; name: string }>(),
      withActiveIds()
    );

    const store = new Store({ state, config, name: '' });

    expect(store.query(getActiveEntities({ ref: personEntitiesRef }))).toEqual(
      []
    );

    store.update(
      addEntities([{ id: 1, name: '' }], { ref: personEntitiesRef })
    );
    store.update(setActiveIds([1]));

    const activeRefEntities = store.query(
      getActiveEntities({ ref: personEntitiesRef })
    );

    expect(activeRefEntities).toEqual([{ id: 1, name: '' }]);
    expectTypeOf(activeRefEntities).toEqualTypeOf<
      { id: number; name: string }[]
    >();
  });
});
