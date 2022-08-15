import {
  createEntitiesStore,
  createTodo,
  toMatchSnapshot,
} from '@ngneat/elf-mocks';
import { addEntities } from './add.mutation';
import { moveEntity } from './move.mutation';

describe('move', () => {
  let store: ReturnType<typeof createEntitiesStore>;

  beforeEach(() => {
    store = createEntitiesStore();
  });

  it('should move entity', () => {
    store.update(addEntities([createTodo(1), createTodo(2)]));
    store.update(moveEntity({ fromIndex: 0, toIndex: 1 }));
    toMatchSnapshot(expect, store, 'move 1 to 2');
  });
});
