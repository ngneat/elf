import { createStore, withProps } from '@ngneat/elf';
import {
  withEntities,
  withUIEntities,
  UIEntitiesRef,
  entitiesPropsFactory,
  DefaultEntitiesRef,
  setEntities,
  updateEntities,
  upsertEntitiesById,
  getAllEntities,
} from '@ngneat/elf-entities';
import {
  entitiesStateHistory,
  EntitiesStateHistory,
} from './entities-state-history';
import { expectTypeOf } from 'expect-type';

interface Entity {
  id: number;
  label: string;
}

describe('entities state history', () => {
  it('should be able to be used only with entities', () => {
    const { withProductEntities, productEntitiesRef } =
      entitiesPropsFactory('product');
    const propsStore = createStore(
      { name: '' },
      withProps<{ loading?: boolean }>({})
    );
    // It doesn't work without entities
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    entitiesStateHistory(propsStore);

    const wrongEntitiesStore = createStore(
      { name: '' },
      withEntities<Entity>()
    );
    // It doesn't work with wrong passed entities ref
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    entitiesStateHistory(wrongEntitiesStore, { entitiesRef: UIEntitiesRef });

    const wrongUIEntitiesStore = createStore(
      { name: '' },
      withUIEntities<Entity>()
    );
    // It doesn't work with wrong passed entities ref
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    entitiesStateHistory(wrongUIEntitiesStore);

    const wrongProductEntitiesStore = createStore(
      { name: '' },
      withProductEntities<{ id: string }>()
    );
    // It doesn't work with wrong passed entities ref
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    entitiesStateHistory(wrongProductEntitiesStore);

    const entitiesStore = createStore({ name: '' }, withEntities<Entity>());
    const entitiesHistory = entitiesStateHistory(entitiesStore);

    expectTypeOf(entitiesHistory).toEqualTypeOf<
      EntitiesStateHistory<typeof entitiesStore, DefaultEntitiesRef>
    >();

    const uiEntitiesStore = createStore(
      { name: '' },
      withUIEntities<Entity, 'label'>({ idKey: 'label' })
    );
    const uiEntitiesHistory = entitiesStateHistory(uiEntitiesStore, {
      entitiesRef: UIEntitiesRef,
    });

    expectTypeOf(uiEntitiesHistory).toEqualTypeOf<
      EntitiesStateHistory<typeof uiEntitiesStore, typeof UIEntitiesRef>
    >();

    const productEntitiesStore = createStore(
      { name: '' },
      withProductEntities<{ id: string }>()
    );
    const productEntitiesHistory = entitiesStateHistory(productEntitiesStore, {
      entitiesRef: productEntitiesRef,
    });

    expectTypeOf(productEntitiesHistory).toEqualTypeOf<
      EntitiesStateHistory<
        typeof productEntitiesStore,
        typeof productEntitiesRef
      >
    >();
  });

  it('should set the current state', () => {
    const store = createStore({ name: '' }, withEntities<Entity>());
    const history = entitiesStateHistory(store);

    expect((history as any).entitiesHistory).toEqual(new Map());
  });

  it('should work', () => {
    const store = createStore({ name: '' }, withEntities<Entity>());
    const history = entitiesStateHistory(store);

    store.update(
      // id: 1 - base; id: 2 - base
      setEntities([
        { id: 1, label: 'first' },
        { id: 2, label: 'second' },
      ])
    );

    // id: 1 - 1 update
    store.update(updateEntities(1, { label: 'not first' }));
    // id: 2 - 1 update
    store.update(updateEntities(2, { label: 'not second' }));
    // id: 2 - 2 update
    store.update(updateEntities(2, { label: 'not second again' }));
    // id: 2 - 3 update; id: 3 - base
    store.update(
      upsertEntitiesById([2, 3], {
        updater: (e) => ({ ...e, label: 'upsert test' }),
        creator: (id) => ({ id, label: 'upsert test' }),
      })
    );
    // id: 2 - 4 update; id: 3 - 1 update
    store.update(
      upsertEntitiesById([2, 3], {
        updater: (e) => ({ ...e, label: 'upsert test 1' }),
        creator: (id) => ({ id, label: 'upsert test 1' }),
      })
    );

    // id: 2 - to 3 update; id: 3 - to base
    history.undo([2, 3]);

    expect(history.hasFuture(2)).toBeTruthy();
    expect(history.hasPast(2)).toBeTruthy();
    expect(history.hasFuture(3)).toBeTruthy();
    expect(history.hasPast(3)).toBeFalsy();

    expect(store.query(getAllEntities())).toEqual([
      { id: 1, label: 'not first' },
      { id: 2, label: 'upsert test' },
      { id: 3, label: 'upsert test' },
    ]);

    // id: 1 - 2 update; id: 2 - 4 update; id: 3 - 1 update
    store.update(updateEntities([1, 2, 3], { label: 'multiple update test' }));

    expect(history.hasPast(1)).toBeTruthy();
    expect(history.hasPast(2)).toBeTruthy();
    expect(history.hasPast(3)).toBeTruthy();

    // id: 1 - to 1 update
    history.undo(1);
    // id: 1 - to base; id: 2 - to 3 update
    history.undo([1, 2]);

    expect(history.hasFuture(1)).toBeTruthy();
    expect(history.hasPast(1)).toBeFalsy();
    expect(history.hasFuture(2)).toBeTruthy();
    expect(history.hasPast(2)).toBeTruthy();
    expect(store.query(getAllEntities())).toEqual([
      { id: 1, label: 'first' },
      { id: 2, label: 'upsert test' },
      { id: 3, label: 'multiple update test' },
    ]);

    // id: 1 - to 1 update;
    history.redo(1);
    // id: 1 - to 2 update; id: 2 - to 4 update
    history.redo([1, 2]);

    expect(history.hasFuture(1)).toBeFalsy();
    expect(history.hasFuture(2)).toBeTruthy();
    expect(store.query(getAllEntities())).toEqual([
      { id: 1, label: 'multiple update test' },
      { id: 2, label: 'multiple update test' },
      { id: 3, label: 'multiple update test' },
    ]);

    // id: 1 - to 1 update; id: 2 - to 3 update; id: 3 - to base
    history.undo();
    // id: 1 - to base; id: 2 - to 2 update; id: 3 - to base
    history.undo();

    expect(history.hasFuture(1)).toBeTruthy();
    expect(history.hasFuture(2)).toBeTruthy();
    expect(history.hasPast(1)).toBeFalsy();
    expect(history.hasPast(2)).toBeTruthy();
    expect(store.query(getAllEntities())).toEqual([
      { id: 1, label: 'first' },
      { id: 2, label: 'not second again' },
      { id: 3, label: 'upsert test' },
    ]);

    // id: 1 - base; id: 2 - base; id: 3 - base
    history.clearPast();

    expect(history.hasFuture(1)).toBeTruthy();
    expect(history.hasPast(1)).toBeFalsy();
    expect(history.hasFuture(2)).toBeTruthy();
    expect(history.hasPast(2)).toBeFalsy();
    expect(history.hasFuture(3)).toBeTruthy();
    expect(history.hasPast(3)).toBeFalsy();
    expect(store.query(getAllEntities())).toEqual([
      { id: 1, label: 'first' },
      { id: 2, label: 'not second again' },
      { id: 3, label: 'upsert test' },
    ]);

    // id: 2 - 1 update
    store.update(updateEntities(2, { label: 'not second' }));
    // id: 2 - 2 update
    store.update(updateEntities(2, { label: 'not second again' }));
    // id: 2 - 3 update
    store.update(updateEntities(2, { label: 'second' }));
    // id: 2 - 4 update
    store.update(updateEntities(2, { label: 'not second 2' }));

    expect(history.hasPast(2)).toBeTruthy();

    // nothing changed because index is invalid
    history.jumpToPast(8, 2);

    expect(store.query(getAllEntities())).toEqual([
      { id: 1, label: 'first' },
      { id: 2, label: 'not second 2' },
      { id: 3, label: 'upsert test' },
    ]);

    // id: 2 - to 1 update
    history.jumpToPast(1, 2);

    expect(store.query(getAllEntities())).toEqual([
      { id: 1, label: 'first' },
      { id: 2, label: 'not second' },
      { id: 3, label: 'upsert test' },
    ]);

    // id: 1 - 1 update
    store.update(updateEntities(1, { label: 'not first' }));
    // id: 1 - 2 update
    store.update(updateEntities(1, { label: 'not first again' }));

    // id: 1 - to base; id: 2 - to base
    history.jumpToPast(0);

    expect(store.query(getAllEntities())).toEqual([
      { id: 1, label: 'first' },
      { id: 2, label: 'not second again' },
      { id: 3, label: 'upsert test' },
    ]);

    // id: 1 - to 1 update
    history.jumpToFuture(2, 1);

    expect(store.query(getAllEntities())).toEqual([
      { id: 1, label: 'not first' },
      { id: 2, label: 'not second again' },
      { id: 3, label: 'upsert test' },
    ]);

    history.clear();

    // id: 1 - base; id: 2 - base; id: 3 - base
    store.update(updateEntities([1, 2, 3], { label: 'clear test' }));
    // id: 1 - update 1; id: 2 - update 1; id: 3 - update 1
    store.update(updateEntities([1, 2, 3], { label: 'clear test 1' }));
    // id: 1 - update 2; id: 2 - update 2; id: 3 - update 2
    store.update(updateEntities([1, 2, 3], { label: 'clear test 2' }));

    // id: 2 - to base; id: 3 - to base
    history.jumpToPast(0, [2, 3]);

    expect(store.query(getAllEntities())).toEqual([
      { id: 1, label: 'clear test 2' },
      { id: 2, label: 'clear test' },
      { id: 3, label: 'clear test' },
    ]);

    history.clearFuture([2, 3]);

    expect(history.hasFuture(2)).toBeFalsy();
    expect(history.hasFuture(3)).toBeFalsy();

    history.clear();
    history.pause();

    store.update(updateEntities([1, 2, 3], { label: 'pause test' }));
    store.update(updateEntities([1, 2, 3], { label: 'pause test 1' }));
    store.update(updateEntities([1, 2, 3], { label: 'pause test 2' }));

    expect(history.hasFuture(1)).toBeFalsy();
    expect(history.hasPast(1)).toBeFalsy();
    expect(history.hasFuture(2)).toBeFalsy();
    expect(history.hasPast(2)).toBeFalsy();
    expect(history.hasFuture(3)).toBeFalsy();
    expect(history.hasPast(3)).toBeFalsy();

    history.resume([1, 3]);

    store.update(updateEntities([1, 2, 3], { label: 'resume test' }));
    store.update(updateEntities([1, 2, 3], { label: 'resume test 1' }));
    store.update(updateEntities([1, 2, 3], { label: 'resume test 2' }));

    history.undo([1, 3]);

    expect(history.hasFuture(1)).toBeTruthy();
    expect(history.hasPast(1)).toBeTruthy();
    expect(history.hasFuture(3)).toBeTruthy();
    expect(history.hasPast(3)).toBeTruthy();

    // id: 2 still paused
    expect(history.hasFuture(2)).toBeFalsy();
    expect(history.hasPast(2)).toBeFalsy();
  });

  it('should work with entityRef', () => {
    const store = createStore(
      { name: '' },
      withUIEntities<
        {
          uiId: number;
          status: 'loading' | 'idle' | 'error' | 'success';
        },
        'uiId'
      >({ idKey: 'uiId' })
    );
    const history = entitiesStateHistory(store, { entitiesRef: UIEntitiesRef });

    store.update(
      // uiId: 1 - base; uiId: 2 - base
      setEntities(
        [
          { uiId: 1, status: 'idle' },
          { uiId: 2, status: 'idle' },
        ],
        { ref: UIEntitiesRef }
      )
    );

    // uiId: 1 - 1 update
    store.update(
      updateEntities(1, { status: 'loading' }, { ref: UIEntitiesRef })
    );
    // uiId: 2 - 1 update
    store.update(
      updateEntities(2, { status: 'loading' }, { ref: UIEntitiesRef })
    );
    // uiId: 2 - 2 update
    store.update(
      updateEntities(2, { status: 'success' }, { ref: UIEntitiesRef })
    );

    // uiId: 2 - to 1 update
    history.undo(2);

    expect(history.hasFuture(2)).toBeTruthy();
    expect(history.hasPast(2)).toBeTruthy();

    expect(store.query(getAllEntities({ ref: UIEntitiesRef }))).toEqual([
      { uiId: 1, status: 'loading' },
      { uiId: 2, status: 'loading' },
    ]);

    // uiId: 1 - 2 update; uiId: 2 - 2 update
    store.update(
      updateEntities([1, 2], { status: 'error' }, { ref: UIEntitiesRef })
    );

    expect(history.hasPast(1)).toBeTruthy();
    expect(history.hasPast(2)).toBeTruthy();

    // uiId: 1 - to 1 update
    history.undo(1);
    // uiId: 1 - to base; uiId: 2 - to 1 update
    history.undo([1, 2]);

    expect(history.hasFuture(1)).toBeTruthy();
    expect(history.hasPast(1)).toBeFalsy();
    expect(history.hasFuture(2)).toBeTruthy();
    expect(history.hasPast(2)).toBeTruthy();
    expect(store.query(getAllEntities({ ref: UIEntitiesRef }))).toEqual([
      { uiId: 1, status: 'idle' },
      { uiId: 2, status: 'loading' },
    ]);

    // uiId: 1 - to 1 update;
    history.redo(1);
    // uiId: 1 - to 2 update; uiId: 2 - to 2 update
    history.redo([1, 2]);

    expect(history.hasFuture(1)).toBeFalsy();
    expect(history.hasFuture(2)).toBeTruthy();
    expect(store.query(getAllEntities({ ref: UIEntitiesRef }))).toEqual([
      { uiId: 1, status: 'error' },
      { uiId: 2, status: 'error' },
    ]);

    // uiId: 1 - to 1 update; uiId: 2 - to 1 update
    history.undo();
    // uiId: 1 - to base; uiId: 2 - to base
    history.undo();

    expect(history.hasFuture(1)).toBeTruthy();
    expect(history.hasFuture(2)).toBeTruthy();
    expect(history.hasPast(1)).toBeFalsy();
    expect(history.hasPast(2)).toBeFalsy();
    expect(store.query(getAllEntities({ ref: UIEntitiesRef }))).toEqual([
      { uiId: 1, status: 'idle' },
      { uiId: 2, status: 'idle' },
    ]);

    // uiId: 1 - to 1 update; uiId: 2 - to 1 update
    history.redo();
    // uiId: 1 - base; uiId: 2 - base
    history.clearPast();

    expect(history.hasFuture(1)).toBeTruthy();
    expect(history.hasPast(1)).toBeFalsy();
    expect(history.hasFuture(2)).toBeTruthy();
    expect(history.hasPast(2)).toBeFalsy();
    expect(store.query(getAllEntities({ ref: UIEntitiesRef }))).toEqual([
      { uiId: 1, status: 'loading' },
      { uiId: 2, status: 'loading' },
    ]);

    // uiId: 2 - 1 update
    store.update(
      updateEntities(2, { status: 'error' }, { ref: UIEntitiesRef })
    );
    // uiId: 2 - 2 update
    store.update(
      updateEntities(2, { status: 'success' }, { ref: UIEntitiesRef })
    );
    // uiId: 2 - 3 update
    store.update(
      updateEntities(2, { status: 'loading' }, { ref: UIEntitiesRef })
    );
    // uiId: 2 - 4 update
    store.update(updateEntities(2, { status: 'idle' }, { ref: UIEntitiesRef }));

    expect(history.hasPast(2)).toBeTruthy();

    // nothing changed because index is invalid
    history.jumpToPast(8, 2);

    expect(store.query(getAllEntities({ ref: UIEntitiesRef }))).toEqual([
      { uiId: 1, status: 'loading' },
      { uiId: 2, status: 'idle' },
    ]);

    // uiId: 2 - to 1 update
    history.jumpToPast(1, 2);

    expect(store.query(getAllEntities({ ref: UIEntitiesRef }))).toEqual([
      { uiId: 1, status: 'loading' },
      { uiId: 2, status: 'error' },
    ]);

    // uiId: 1 - 1 update
    store.update(
      updateEntities(1, { status: 'error' }, { ref: UIEntitiesRef })
    );
    // uiId: 1 - 2 update
    store.update(
      updateEntities(1, { status: 'success' }, { ref: UIEntitiesRef })
    );

    // uiId: 1 - to base; uiId: 2 - to base
    history.jumpToPast(0);

    expect(store.query(getAllEntities({ ref: UIEntitiesRef }))).toEqual([
      { uiId: 1, status: 'loading' },
      { uiId: 2, status: 'loading' },
    ]);

    // uiId: 1 - to 1 update
    history.jumpToFuture(2, 1);

    expect(store.query(getAllEntities({ ref: UIEntitiesRef }))).toEqual([
      { uiId: 1, status: 'error' },
      { uiId: 2, status: 'loading' },
    ]);

    history.clear();

    // uiId: 1 - base; uiId: 2 - base
    store.update(
      updateEntities([1, 2], { status: 'error' }, { ref: UIEntitiesRef })
    );
    // uiId: 1 - update 1; uiId: 2 - update 1
    store.update(
      updateEntities([1, 2], { status: 'success' }, { ref: UIEntitiesRef })
    );
    // uiId: 1 - update 2; uiId: 2 - update 2
    store.update(
      updateEntities([1, 2], { status: 'idle' }, { ref: UIEntitiesRef })
    );

    // uiId: 1 - to base; uiId: 2 - to base
    history.jumpToPast(0);

    expect(store.query(getAllEntities({ ref: UIEntitiesRef }))).toEqual([
      { uiId: 1, status: 'error' },
      { uiId: 2, status: 'error' },
    ]);

    history.clearFuture(2);

    expect(history.hasFuture(2)).toBeFalsy();

    history.clear();
    history.pause();

    store.update(
      updateEntities([1, 2], { status: 'idle' }, { ref: UIEntitiesRef })
    );
    store.update(
      updateEntities([1, 2], { status: 'success' }, { ref: UIEntitiesRef })
    );
    store.update(
      updateEntities([1, 2], { status: 'loading' }, { ref: UIEntitiesRef })
    );

    expect(history.hasFuture(1)).toBeFalsy();
    expect(history.hasPast(1)).toBeFalsy();
    expect(history.hasFuture(2)).toBeFalsy();
    expect(history.hasPast(2)).toBeFalsy();

    history.resume(1);

    store.update(
      updateEntities([1, 2], { status: 'idle' }, { ref: UIEntitiesRef })
    );
    store.update(
      updateEntities([1, 2], { status: 'success' }, { ref: UIEntitiesRef })
    );
    store.update(
      updateEntities([1, 2], { status: 'loading' }, { ref: UIEntitiesRef })
    );

    history.undo(1);

    expect(history.hasFuture(1)).toBeTruthy();
    expect(history.hasPast(1)).toBeTruthy();

    // uiId: 2 still paused
    expect(history.hasFuture(2)).toBeFalsy();
    expect(history.hasPast(2)).toBeFalsy();
  });

  it('should work with initial entities', function () {
    const store = createStore(
      { name: '' },
      withEntities<Entity>({
        initialValue: [
          { id: 1, label: 'first' },
          { id: 2, label: 'second' },
        ],
      })
    );
    const history = entitiesStateHistory(store);

    store.update(updateEntities([1, 2], { label: 'Renamed entity' }));

    history.undo(1);

    expect(store.query(getAllEntities())).toEqual([
      { id: 1, label: 'first' },
      { id: 2, label: 'Renamed entity' },
    ]);
  });

  it('should track only passed ids', () => {
    const store = createStore({ name: '' }, withEntities<Entity>());
    const history = entitiesStateHistory(store, { entityIds: [2] });

    store.update(
      setEntities([
        { id: 1, label: 'first' },
        { id: 2, label: 'second' },
      ])
    );

    store.update(updateEntities([1, 2], { label: 'updateEntities' }));
    store.update(updateEntities([1, 2], { label: 'updateEntities 1' }));

    history.undo(1);
    history.undo([1, 2]);

    expect(store.query(getAllEntities())).toEqual([
      { id: 1, label: 'updateEntities 1' },
      { id: 2, label: 'updateEntities' },
    ]);

    history.redo(1);
    history.redo([1, 2]);

    expect(store.query(getAllEntities())).toEqual([
      { id: 1, label: 'updateEntities 1' },
      { id: 2, label: 'updateEntities 1' },
    ]);

    history.jumpToPast(1, 1);
    history.jumpToPast(1, [1, 2]);

    expect(store.query(getAllEntities())).toEqual([
      { id: 1, label: 'updateEntities 1' },
      { id: 2, label: 'updateEntities' },
    ]);

    history.jumpToFuture(1, 1);
    history.jumpToFuture(0, [1, 2]);

    expect(store.query(getAllEntities())).toEqual([
      { id: 1, label: 'updateEntities 1' },
      { id: 2, label: 'updateEntities 1' },
    ]);
  });

  it('should update history if only comparatorFn allows', () => {
    const store = createStore(
      { name: '' },
      withEntities<{ id: number; nested: { nestedTwo: { name: string } } }>()
    );
    const history = entitiesStateHistory(store, {
      comparatorFn: (prevState, currentState) =>
        prevState.nested.nestedTwo !== currentState.nested.nestedTwo,
    });

    store.update(
      setEntities([{ id: 1, nested: { nestedTwo: { name: 'first' } } }])
    );
    store.update(updateEntities(1, (entity) => ({ ...entity })));

    expect(history.hasPast(1)).toBeFalsy();

    store.update(
      updateEntities(1, (entity) => ({
        ...entity,
        nested: { nestedTwo: { name: 'updated first' } },
      }))
    );

    expect(history.hasPast(1)).toBeTruthy();
  });

  it('should track only passed entitiesRef', () => {
    const store = createStore(
      { name: '' },
      withEntities<Entity>(),
      withUIEntities<{ id: string; selected: boolean }>()
    );
    const history = entitiesStateHistory(store, { entitiesRef: UIEntitiesRef });

    store.update(
      setEntities([
        { id: 1, label: 'first' },
        { id: 2, label: 'second' },
      ]),
      setEntities(
        [
          { id: '1', selected: false },
          { id: '2', selected: false },
        ],
        { ref: UIEntitiesRef }
      )
    );

    store.update(updateEntities([1, 2], { label: 'updateEntities 1' }));
    store.update(
      updateEntities(['1', '2'], { selected: true }, { ref: UIEntitiesRef })
    );

    history.undo(['1', '2']);

    expect(store.query(getAllEntities())).toEqual([
      { id: 1, label: 'updateEntities 1' },
      { id: 2, label: 'updateEntities 1' },
    ]);
    expect(store.query(getAllEntities({ ref: UIEntitiesRef }))).toEqual([
      { id: '1', selected: false },
      { id: '2', selected: false },
    ]);
  });

  it('it should return the past of entities', () => {
    const store = createStore({ name: '' }, withEntities<Entity>());
    const history = entitiesStateHistory(store);

    store.update(
      setEntities([
        { id: 1, label: 'first' },
        { id: 2, label: 'second' },
      ])
    );

    store.update(updateEntities([1, 2], { label: 'updateEntities' }));
    store.update(updateEntities([1, 2], { label: 'updateEntities 1' }));

    expect(history.getEntitiesPast()).toEqual({
      1: [
        { id: 1, label: 'first' },
        { id: 1, label: 'updateEntities' },
      ],
      2: [
        { id: 2, label: 'second' },
        { id: 2, label: 'updateEntities' },
      ],
    });

    history.clearPast(1);

    expect(history.getEntitiesPast()).toEqual({
      2: [
        { id: 2, label: 'second' },
        { id: 2, label: 'updateEntities' },
      ],
    });
    expect(history.getEntitiesPast({ showIfEmpty: true })).toEqual({
      1: [],
      2: [
        { id: 2, label: 'second' },
        { id: 2, label: 'updateEntities' },
      ],
    });
  });

  it('it should return the future of entities', () => {
    const store = createStore({ name: '' }, withEntities<Entity>());
    const history = entitiesStateHistory(store);

    store.update(
      setEntities([
        { id: 1, label: 'first' },
        { id: 2, label: 'second' },
      ])
    );

    store.update(updateEntities([1, 2], { label: 'updateEntities' }));
    store.update(updateEntities([1, 2], { label: 'updateEntities 1' }));
    history.undo();
    history.undo();

    expect(history.getEntitiesFuture()).toEqual({
      1: [
        { id: 1, label: 'updateEntities' },
        { id: 1, label: 'updateEntities 1' },
      ],
      2: [
        { id: 2, label: 'updateEntities' },
        { id: 2, label: 'updateEntities 1' },
      ],
    });

    history.clearFuture(1);

    expect(history.getEntitiesFuture()).toEqual({
      2: [
        { id: 2, label: 'updateEntities' },
        { id: 2, label: 'updateEntities 1' },
      ],
    });
    expect(history.getEntitiesFuture({ showIfEmpty: true })).toEqual({
      1: [],
      2: [
        { id: 2, label: 'updateEntities' },
        { id: 2, label: 'updateEntities 1' },
      ],
    });
  });
});
