import { createEntitiesStore, createTodo } from '../mocks/stores.mock';
import { addEntity } from './add.mutation';
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
      addEntity(createTodo(2))
    );
  });

});
