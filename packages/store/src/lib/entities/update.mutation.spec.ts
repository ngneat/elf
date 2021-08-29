import {
  createEntitiesStore,
  createTodo,
  createUIEntityStore,
  createUITodo,
  toMatchSnapshot,
} from '../mocks/stores.mock';
import { addEntities } from './add.mutation';
import {
  updateAllEntities,
  updateEntities,
  updateEntitiesByPredicate,
} from './update.mutation';
import { UIEntitiesRef } from './entity.state';

describe('update', () => {
  let store: ReturnType<typeof createEntitiesStore>;

  beforeEach(() => {
    store = createEntitiesStore();
  });

  it('should update one entity', () => {
    store.reduce(addEntities(createTodo(1)));
    toMatchSnapshot(expect, store, 'completed false');
    store.reduce(updateEntities(1, { completed: true }));
    toMatchSnapshot(expect, store, 'completed true');
  });

  it('should update multiple entities', () => {
    store.reduce(addEntities([createTodo(1), createTodo(2)]));
    toMatchSnapshot(expect, store, 'multi completed false');
    store.reduce(updateEntities([1, 2], { completed: true }));
    toMatchSnapshot(expect, store, 'multi completed true');
  });

  it('should update by callback', () => {
    store.reduce(addEntities(createTodo(1)));
    toMatchSnapshot(expect, store, 'completed false');
    store.reduce(
      updateEntities(1, (todo) => ({ ...todo, completed: !todo.completed }))
    );
    toMatchSnapshot(expect, store, 'completed true');
  });

  it('should update by predicate', () => {
    store.reduce(addEntities([createTodo(1), createTodo(2)]));
    toMatchSnapshot(expect, store, 'completed false');
    store.reduce(
      updateEntitiesByPredicate((entity) => entity.id === 1, {
        completed: true,
      })
    );
    toMatchSnapshot(expect, store, 'completed true');
  });

  it('should update all', () => {
    store.reduce(addEntities([createTodo(1), createTodo(2)]));
    toMatchSnapshot(expect, store, 'completed false');
    store.reduce(updateAllEntities({ completed: true }));
    toMatchSnapshot(expect, store, 'completed true');
  });

  it('should work with ref', () => {
    const store = createUIEntityStore();
    store.reduce(
      addEntities([createUITodo(1), createUITodo(2)], { ref: UIEntitiesRef })
    );
    toMatchSnapshot(expect, store, 'open false');
    store.reduce(updateEntities(1, { open: true }, { ref: UIEntitiesRef }));
    toMatchSnapshot(expect, store, 'open true');
  });

  it('should work with ref update all', () => {
    const store = createUIEntityStore();
    store.reduce(
      addEntities([createUITodo(1), createUITodo(2)], { ref: UIEntitiesRef })
    );
    toMatchSnapshot(expect, store, 'open false');
    store.reduce(updateAllEntities({ open: true }, { ref: UIEntitiesRef }));
    toMatchSnapshot(expect, store, 'open true');
  });
});
