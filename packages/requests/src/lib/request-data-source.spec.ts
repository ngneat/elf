import { createState, Store } from '@ngneat/elf';
import {
  selectRequestStatus,
  updateRequestStatus,
  withRequestsStatus,
} from './requests-status';
import { addEntities, selectAll, withEntities } from '@ngneat/elf-entities';
import { createTodo, Todo } from '@ngneat/elf-mocks';
import { createRequestDataSource } from './request-data-source';
import { expectTypeOf } from 'expect-type';

describe('createRequestDataSource', () => {
  it('should work', () => {
    const { state, config } = createState(
      withEntities<Todo>(),
      withRequestsStatus()
    );

    const store = new Store({ state, config, name: '' });

    const todos$ = store.pipe(selectAll());
    const status$ = store.pipe(selectRequestStatus('todos'));

    const todosDataSource$ = createRequestDataSource({
      dataKey: 'todos',
      data$: todos$,
      status$,
    });

    const spy = jest.fn();

    todosDataSource$.subscribe((v) => {
      expectTypeOf(v).toEqualTypeOf<{
        loading: boolean;
        error: any;
        todos: Todo[];
      }>();

      spy(v);
    });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({
      loading: true,
      error: undefined,
      todos: [],
    });

    store.reduce(updateRequestStatus('todos', 'success'));

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith({
      loading: false,
      error: undefined,
      todos: [],
    });

    store.reduce(addEntities(createTodo(1)));

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenCalledWith({
      loading: false,
      error: undefined,
      todos: [createTodo(1)],
    });

    store.reduce(updateRequestStatus('todos', 'error', { type: 'foo' }));

    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy).toHaveBeenCalledWith({
      loading: false,
      error: { type: 'foo' },
      todos: [createTodo(1)],
    });
  });
});
