import {
  createEntitiesStore,
  createTodo,
  createUIEntityStore,
  createUITodo,
} from '../mocks/stores.mock';
import { addEntities } from './add.mutation';
import { selectAll, selectEntities } from './all.query';
import { UIEntitiesRef } from './entity.state';

describe('selectAll', () => {
  let store: ReturnType<typeof createEntitiesStore>;

  beforeEach(() => {
    store = createEntitiesStore();
  });

  it('should select all', () => {
    let count = 1;

    store.pipe(selectAll()).subscribe((value) => {
      expect(value).toMatchSnapshot(`calls: ${count++}`);
    });

    store.reduce(addEntities(createTodo(2)));
  });

  it('should work with ref', () => {
    let count = 1;

    const store = createUIEntityStore();

    store.pipe(selectAll({ ref: UIEntitiesRef })).subscribe((value) => {
      expect(value).toMatchSnapshot(`calls: ${count++}`);
    });

    store.reduce(
      addEntities([createUITodo(1), createUITodo(2)], { ref: UIEntitiesRef })
    );
  });

  it('should observe entities object', () => {
    store.pipe(selectEntities()).subscribe((v) => {
      expect(v).toMatchSnapshot('should be an object');
    });

    store.reduce(addEntities(createTodo(1)));
  });
});
