import {
  createEntitiesStore,
  createTodo,
  createUIEntityStore,
  createUITodo,
  toMatchSnapshot,
} from '@ngneat/elf-mocks';
import { addEntities } from './add.mutation';
import {
  deleteAllEntities,
  deleteEntities,
  deleteEntitiesByPredicate,
} from './delete.mutation';
import { UIEntitiesRef } from './entity.state';

describe('delete', () => {
  let store: ReturnType<typeof createEntitiesStore>;

  beforeEach(() => {
    store = createEntitiesStore();
  });

  it('should delete entity', () => {
    store.update(addEntities([createTodo(1), createTodo(2)]));
    toMatchSnapshot(expect, store, 'should have two entities');
    store.update(deleteEntities(1));
    toMatchSnapshot(expect, store, 'should delete one entity');
  });

  it('should delete entities', () => {
    store.update(addEntities([createTodo(1), createTodo(2), createTodo(3)]));
    toMatchSnapshot(expect, store, 'should have three entities');
    store.update(deleteEntities([1, 2]));
    toMatchSnapshot(expect, store, 'should delete two entities');
  });

  it('should delete all the entities', () => {
    store.update(addEntities([createTodo(1), createTodo(2), createTodo(3)]));
    toMatchSnapshot(expect, store, 'should have three entities');
    store.update(deleteAllEntities());
    toMatchSnapshot(expect, store, 'should delete all');
  });

  it('should delete by predicate', () => {
    store.update(addEntities([createTodo(1), createTodo(2), createTodo(3)]));
    toMatchSnapshot(expect, store, 'should have three entities');
    store.update(deleteEntitiesByPredicate((entity) => entity.id === 1));
    toMatchSnapshot(expect, store, 'should delete the entity with id of 1');
  });

  it('should work with ref', () => {
    const store = createUIEntityStore();
    store.update(
      addEntities([createUITodo(1), createUITodo(2)], { ref: UIEntitiesRef })
    );
    toMatchSnapshot(expect, store, 'should have three ui entities');
    store.update(
      deleteEntitiesByPredicate((entity) => entity.id === 1, {
        ref: UIEntitiesRef,
      })
    );
    toMatchSnapshot(expect, store, 'should delete the ui entity with id of 1');
  });
});
