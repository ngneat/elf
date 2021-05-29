import { createEntitiesStore, createTodo } from '../mocks/stores.mock';
import { addEntities } from './add.mutation';
import { selectAll } from './all.query';

describe('selectAll', () => {
  let store: ReturnType<typeof createEntitiesStore>;

  beforeEach(() => {
    store = createEntitiesStore();
  });

  it('should query all', () => {
    store.pipe(selectAll()).subscribe(value => {
      expect(value).toMatchSnapshot();
    });

    store.reduce(
      addEntities(createTodo(2))
    );
  });

});
