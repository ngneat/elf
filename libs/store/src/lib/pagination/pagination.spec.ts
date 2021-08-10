import {
  hasPage,
  selectActivePage,
  selectActivePageEntities,
  setActivePage,
  setPage,
  withPagination,
} from './pagination';
import { createTodo } from '../mocks/stores.mock';
import { withEntities } from '../entities/entity.state';
import { createState, Store } from '../core';
import { addEntities } from '../entities';

describe('withPagination', () => {
  it('should work', () => {
    const { state, config } = createState(
      withEntities<{ id: number }>(),
      withPagination()
    );
    const store = new Store({ name: '', config, state });

    store.reduce(addEntities([createTodo(1), createTodo(2)]));
    store.reduce(setPage(0, [1, 2]));

    store.pipe(selectActivePage()).subscribe((v) => {
      console.log('selectActivePage', v);
    });

    store.pipe(selectActivePageEntities()).subscribe((v) => {
      console.log(v);
    });

    store.reduce(addEntities([createTodo(3), createTodo(4)]));
    store.reduce(setPage(1, [3, 4]), setActivePage(1));

    store.reduce(setActivePage(0));

    console.log(store.query(hasPage(1)));
  });
});
