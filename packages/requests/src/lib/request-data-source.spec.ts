import { createState, Store } from '@ngneat/elf';
import {
  updateRequestStatus,
  withRequestsStatus,
  StatusState,
} from './requests-status';
import {
  addEntities,
  selectAllEntities,
  selectEntity,
  setEntities,
  withEntities,
} from '@ngneat/elf-entities';
import { createTodo, Todo } from '@ngneat/elf-mocks';
import {
  createRequestDataSource,
  DataSource,
  DynamicKeyDataSource,
} from './request-data-source';
import { expectTypeOf } from 'expect-type';
import { mapTo, tap, timer } from 'rxjs';
import { withRequestsCache } from '..';

describe('createRequestDataSource', () => {
  it('should work with single source', () => {
    jest.useFakeTimers();

    const { state, config } = createState(
      withEntities<Todo>(),
      withRequestsStatus(),
      withRequestsCache()
    );

    const store = new Store({ state, config, name: 'todos' });

    const {
      setCached,
      setSuccess,
      data$,
      trackRequestStatus,
      skipWhileCached,
    } = createRequestDataSource({
      store,
      data$: () => store.pipe(selectAllEntities()),
      requestKey: 'todos',
      dataKey: 'todos',
    });

    const spy = jest.fn();

    data$().subscribe((v) => {
      spy(v);
    });

    function getTodos() {
      return timer(1000).pipe(
        mapTo([createTodo(1)]),
        tap((todos) =>
          store.update(setEntities(todos), setSuccess(), setCached())
        ),
        trackRequestStatus(),
        skipWhileCached(),
        tap((todos) => {
          // should persist the passed type
          expectTypeOf(todos).toEqualTypeOf<Todo[]>();
        })
      );
    }

    getTodos().subscribe();

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith({
      loading: true,
      error: undefined,
      todos: [],
    });

    jest.runAllTimers();

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenCalledWith({
      loading: false,
      error: undefined,
      todos: [createTodo(1)],
    });

    getTodos().subscribe();

    // it's cached
    expect(spy).toHaveBeenCalledTimes(3);
  });

  it('should work with dynamic source', () => {
    jest.useFakeTimers();

    const { state, config } = createState(
      withEntities<Todo>(),
      withRequestsStatus(),
      withRequestsCache()
    );

    const store = new Store({ state, config, name: 'todos' });

    const {
      setSuccess,
      setCached,
      skipWhileCached,
      trackRequestStatus,
      data$,
    } = createRequestDataSource({
      store,
      data$: (key: number) => store.pipe(selectEntity(key)),
      dataKey: 'todo',
    });

    const spy = jest.fn();

    data$({ key: 1 }).subscribe((v) => {
      spy(v);
    });

    function getTodo() {
      return timer(1000).pipe(
        mapTo(createTodo(1)),
        tap((todo) =>
          store.update(
            addEntities(todo),
            setSuccess({ key: 1 }),
            setCached({ key: 1 })
          )
        ),
        trackRequestStatus({ key: 1 }),
        skipWhileCached({ key: 1 }),
        tap((todo) => {
          // should persist the passed type
          expectTypeOf(todo).toEqualTypeOf<Todo>();
        })
      );
    }

    getTodo().subscribe();

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith({
      loading: true,
      error: undefined,
      todo: undefined,
    });

    jest.runAllTimers();

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenCalledWith({
      loading: false,
      error: undefined,
      todo: createTodo(1),
    });

    getTodo().subscribe();
    expect(spy).toHaveBeenCalledTimes(3);
  });

  it('should work', () => {
    const { state, config } = createState(
      withEntities<Todo>(),
      withRequestsStatus()
    );

    const store = new Store({ state, config, name: '' });

    const todosDataSource = createRequestDataSource({
      store: store,
      dataKey: 'todos',
      requestKey: 'todos',
      idleAsPending: true,
      data$: () => store.pipe(selectAllEntities()),
    });

    const spy = jest.fn();

    todosDataSource.data$().subscribe((v) => {
      expectTypeOf(v).toEqualTypeOf<{
        loading: boolean;
        error: unknown;
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

    store.update(todosDataSource.setSuccess());

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith({
      loading: false,
      error: undefined,
      todos: [],
    });

    store.update(addEntities(createTodo(1)));

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenCalledWith({
      loading: false,
      error: undefined,
      todos: [createTodo(1)],
    });

    store.update(updateRequestStatus('todos', 'error', { type: 'foo' }));

    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy).toHaveBeenCalledWith({
      loading: false,
      error: { type: 'foo' },
      todos: [createTodo(1)],
    });
  });

  it('should not emit if values are the same by ref', () => {
    const { state, config } = createState(
      withEntities<Todo>(),
      withRequestsStatus<'todos'>()
    );

    const store = new Store({ state, config, name: '' });

    const todosDataSource = createRequestDataSource({
      store: store,
      dataKey: 'todos',
      requestKey: 'todos',
      idleAsPending: true,
      data$: () => store.pipe(selectAllEntities()),
    });

    const spy = jest.fn();

    todosDataSource.data$().subscribe(spy);

    expect(spy).toHaveBeenCalledTimes(1);

    store.update(updateRequestStatus('todos', 'pending'));

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should return proper type without using generic on "withRequestsStatus"', () => {
    const { state, config } = createState(
      withEntities<Todo>(),
      withRequestsStatus()
    );

    const store = new Store({ state, config, name: '' });

    const todosDataSource = createRequestDataSource({
      store: store,
      dataKey: 'todos',
      requestKey: 'todos',
      data$: () => store.pipe(selectAllEntities()),
    });

    const todoDataSource = createRequestDataSource({
      store: store,
      dataKey: 'todo',
      data$: (key: number) => store.pipe(selectEntity(key)),
    });

    expectTypeOf(todosDataSource).toEqualTypeOf<
      DataSource<
        { requestsStatus: Record<string, StatusState> } & {
          entities: Record<number, Todo>;
          ids: number[];
        },
        'todos',
        Todo[],
        unknown
      >
    >();
    expectTypeOf(todoDataSource).toEqualTypeOf<
      DynamicKeyDataSource<
        { requestsStatus: Record<string, StatusState> } & {
          entities: Record<number, Todo>;
          ids: number[];
        },
        'todo',
        Todo | undefined,
        unknown
      >
    >();
  });

  it('should return proper type with using generic on "withRequestsStatus"', () => {
    type TodoStatuses = 'get' | 'add' | 'delete';
    const { state, config } = createState(
      withEntities<Todo>(),
      withRequestsStatus<TodoStatuses>()
    );

    const store = new Store({ state, config, name: '' });

    const todosDataSource = createRequestDataSource({
      store: store,
      dataKey: 'todos',
      requestKey: 'get',
      data$: () => store.pipe(selectAllEntities()),
    });

    const todoDataSource = createRequestDataSource({
      store: store,
      dataKey: 'todo',
      data$: (key: number) => store.pipe(selectEntity(key)),
    });

    expectTypeOf(todosDataSource).toEqualTypeOf<
      DataSource<
        { requestsStatus: Record<TodoStatuses, StatusState> } & {
          entities: Record<number, Todo>;
          ids: number[];
        },
        'todos',
        Todo[],
        unknown
      >
    >();
    expectTypeOf(todoDataSource).toEqualTypeOf<
      DynamicKeyDataSource<
        { requestsStatus: Record<TodoStatuses, StatusState> } & {
          entities: Record<number, Todo>;
          ids: number[];
        },
        'todo',
        Todo | undefined,
        unknown
      >
    >();
  });
});
