import { createEntitiesStore, createTodo, createUIEntityStore, createUITodo, toMatchSnapshot } from '../mocks/stores.mock';
import { addEntities } from './add.mutation';
import { removeAllEntities, removeEntities, removeEntitiesByPredicate } from './remove.mutation';
import { entitiesUIRef } from './entity.state';

describe('remove', () => {
  let store: ReturnType<typeof createEntitiesStore>;

  beforeEach(() => {
    store = createEntitiesStore();
  });

  it('should remove entity', () => {
    store.reduce(addEntities([createTodo(1), createTodo(2)]));
    toMatchSnapshot(expect, store, 'should have two entities');
    store.reduce(removeEntities(1));
    toMatchSnapshot(expect, store, 'should remove one entity');
  });

  it('should remove entities', () => {
    store.reduce(addEntities([createTodo(1), createTodo(2), createTodo(3)]));
    toMatchSnapshot(expect, store, 'should have three entities');
    store.reduce(removeEntities([1, 2]));
    toMatchSnapshot(expect, store, 'should remove two entities');
  });

  it('should remove all the entities', () => {
    store.reduce(addEntities([createTodo(1), createTodo(2), createTodo(3)]));
    toMatchSnapshot(expect, store, 'should have three entities');
    store.reduce(removeAllEntities());
    toMatchSnapshot(expect, store, 'should remove all');
  });

  it('should remove by predicate', () => {
    store.reduce(addEntities([createTodo(1), createTodo(2), createTodo(3)]));
    toMatchSnapshot(expect, store, 'should have three entities');
    store.reduce(removeEntitiesByPredicate(entity => entity.id === 1));
    toMatchSnapshot(expect, store, 'should remove the entity with id of 1');
  });

  it('should work with ref', () => {
    const store = createUIEntityStore();
    store.reduce(addEntities([createUITodo(1), createUITodo(2)], { ref: entitiesUIRef }));
    toMatchSnapshot(expect, store, 'should have three ui entities');
    store.reduce(removeEntitiesByPredicate(entity => entity.id === 1, { ref: entitiesUIRef }));
    toMatchSnapshot(expect, store, 'should remove the ui entity with id of 1');
  });

});
