import { createState, Store } from '@ngneat/elf';
import {
  addEntities,
  selectAllEntities,
  selectEntity,
  setEntities,
  upsertEntities,
  withEntities,
} from '@ngneat/elf-entities';
import { createTodo, Todo } from '@ngneat/elf-mocks';
import { expectTypeOf } from 'expect-type';
import { map, Observable, tap, timer } from 'rxjs';
import {
  clearRequestsResult,
  filterSuccess,
  joinRequestResult,
  mapResultData,
  SuccessRequestResult,
  trackRequestResult,
} from './requests-result';

describe('requests result', () => {
  beforeEach(() => {
    clearRequestsResult();
  });

  it('should filter success', () => {
    jest.useFakeTimers();

    const { state, config } = createState(withEntities<Todo>());

    const store = new Store({ state, config, name: 'todos' });

    const entities$ = store.pipe(
      selectAllEntities(),
      joinRequestResult(['todos']),
    );

    const spy = jest.fn();

    entities$.pipe(filterSuccess()).subscribe((value) => {
      spy(value);
      expectTypeOf(value).toEqualTypeOf<
        SuccessRequestResult & { data: Todo[] }
      >();
    });

    function getTodos() {
      return timer(1000).pipe(
        map(() => [createTodo(1)]),
        tap((todos) => store.update(setEntities(todos))),
        trackRequestResult(['todos']),
      );
    }

    getTodos().subscribe();

    jest.runAllTimers();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should mapResultData only when it is defined', () => {
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));

    const { state, config } = createState(withEntities<Todo>());

    const store = new Store({ state, config, name: 'todos' });

    const entities$ = store.pipe(
      selectAllEntities(),
      joinRequestResult(['todos']),
    );

    const spy = jest.fn();

    entities$
      .pipe(
        mapResultData((data) => {
          expectTypeOf(data).toEqualTypeOf<Todo[]>();
          return data.filter((todo) => todo.id === 1);
        }),
      )
      .subscribe((value) => {
        spy(value);
      });

    function getTodos() {
      return timer(1000).pipe(
        map(() => [createTodo(1), createTodo(2)]),
        tap((todos) => store.update(setEntities(todos))),
        trackRequestResult(['todos']),
      );
    }

    getTodos().subscribe();

    jest.runAllTimers();

    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "data": Array [],
            "fetchStatus": "idle",
            "isError": false,
            "isLoading": true,
            "isSuccess": false,
            "status": "loading",
            "successfulRequestsCount": 0,
          },
        ],
        Array [
          Object {
            "data": Array [],
            "fetchStatus": "fetching",
            "isError": false,
            "isLoading": true,
            "isSuccess": false,
            "status": "loading",
            "successfulRequestsCount": 0,
          },
        ],
        Array [
          Object {
            "data": Array [
              Object {
                "completed": false,
                "id": 1,
                "title": "todo 1",
              },
            ],
            "fetchStatus": "fetching",
            "isError": false,
            "isLoading": true,
            "isSuccess": false,
            "status": "loading",
            "successfulRequestsCount": 0,
          },
        ],
        Array [
          Object {
            "data": Array [
              Object {
                "completed": false,
                "id": 1,
                "title": "todo 1",
              },
            ],
            "dataUpdatedAt": 1577836801000,
            "fetchStatus": "idle",
            "isError": false,
            "isLoading": false,
            "isSuccess": true,
            "responseData": undefined,
            "status": "success",
            "successfulRequestsCount": 1,
          },
        ],
      ]
    `);
  });

  it('should work', () => {
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));

    const { state, config } = createState(withEntities<Todo>());

    const store = new Store({ state, config, name: 'todos' });

    const entities$ = store.pipe(
      selectAllEntities(),
      joinRequestResult(['todos']),
    );

    const spy = jest.fn();
    const reqSpy = jest.fn();
    const subscribeSpy = jest.fn();

    entities$.subscribe((value) => {
      spy(value);
    });

    function getTodos() {
      return timer(1000).pipe(
        map(() => [createTodo(1)]),
        tap(() => reqSpy()),
        tap((todos) => store.update(setEntities(todos))),
        trackRequestResult(['todos']),
      );
    }

    getTodos().subscribe((value) => subscribeSpy(value));
    getTodos().subscribe((value) => subscribeSpy(value));

    jest.runAllTimers();

    expect(subscribeSpy).toHaveBeenCalledTimes(2);
    expect(reqSpy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledTimes(4);

    store.update(addEntities(createTodo(2)));

    expect(spy).toHaveBeenCalledTimes(5);

    getTodos().subscribe((value) => subscribeSpy(value));

    jest.runAllTimers();

    // It's cached
    expect(subscribeSpy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenCalledTimes(5);

    expect(spy.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "data": Array [],
            "fetchStatus": "idle",
            "isError": false,
            "isLoading": true,
            "isSuccess": false,
            "status": "loading",
            "successfulRequestsCount": 0,
          },
        ],
        Array [
          Object {
            "data": Array [],
            "fetchStatus": "fetching",
            "isError": false,
            "isLoading": true,
            "isSuccess": false,
            "status": "loading",
            "successfulRequestsCount": 0,
          },
        ],
        Array [
          Object {
            "data": Array [
              Object {
                "completed": false,
                "id": 1,
                "title": "todo 1",
              },
            ],
            "fetchStatus": "fetching",
            "isError": false,
            "isLoading": true,
            "isSuccess": false,
            "status": "loading",
            "successfulRequestsCount": 0,
          },
        ],
        Array [
          Object {
            "data": Array [
              Object {
                "completed": false,
                "id": 1,
                "title": "todo 1",
              },
            ],
            "dataUpdatedAt": 1577836801000,
            "fetchStatus": "idle",
            "isError": false,
            "isLoading": false,
            "isSuccess": true,
            "responseData": undefined,
            "status": "success",
            "successfulRequestsCount": 1,
          },
        ],
        Array [
          Object {
            "data": Array [
              Object {
                "completed": false,
                "id": 1,
                "title": "todo 1",
              },
              Object {
                "completed": false,
                "id": 2,
                "title": "todo 2",
              },
            ],
            "dataUpdatedAt": 1577836801000,
            "fetchStatus": "idle",
            "isError": false,
            "isLoading": false,
            "isSuccess": true,
            "responseData": undefined,
            "status": "success",
            "successfulRequestsCount": 1,
          },
        ],
      ]
    `);
  });

  it('should work with idle status', () => {
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));

    const { state, config } = createState(withEntities<Todo>());

    const store = new Store({ state, config, name: 'todos' });

    const entities$ = store.pipe(
      selectAllEntities(),
      joinRequestResult(['todos'], { initialStatus: 'idle' }),
    );

    const spy = jest.fn();

    entities$.subscribe((value) => {
      spy(value);
    });

    function getTodos() {
      return timer(1000).pipe(
        map(() => [createTodo(1)]),
        tap((todos) => store.update(setEntities(todos))),
        trackRequestResult(['todos']),
      );
    }

    expect(spy.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "data": Array [],
            "fetchStatus": "idle",
            "isError": false,
            "isLoading": false,
            "isSuccess": false,
            "status": "idle",
            "successfulRequestsCount": 0,
          },
        ],
      ]
    `);
    getTodos().subscribe();

    jest.runAllTimers();

    expect(spy).toHaveBeenCalledTimes(4);

    store.update(addEntities(createTodo(2)));

    expect(spy).toHaveBeenCalledTimes(5);
    getTodos().subscribe();

    jest.runAllTimers();

    // It's cached
    expect(spy).toHaveBeenCalledTimes(5);

    expect(spy.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "data": Array [],
            "fetchStatus": "idle",
            "isError": false,
            "isLoading": false,
            "isSuccess": false,
            "status": "idle",
            "successfulRequestsCount": 0,
          },
        ],
        Array [
          Object {
            "data": Array [],
            "fetchStatus": "fetching",
            "isError": false,
            "isLoading": true,
            "isSuccess": false,
            "status": "loading",
            "successfulRequestsCount": 0,
          },
        ],
        Array [
          Object {
            "data": Array [
              Object {
                "completed": false,
                "id": 1,
                "title": "todo 1",
              },
            ],
            "fetchStatus": "fetching",
            "isError": false,
            "isLoading": true,
            "isSuccess": false,
            "status": "loading",
            "successfulRequestsCount": 0,
          },
        ],
        Array [
          Object {
            "data": Array [
              Object {
                "completed": false,
                "id": 1,
                "title": "todo 1",
              },
            ],
            "dataUpdatedAt": 1577836801000,
            "fetchStatus": "idle",
            "isError": false,
            "isLoading": false,
            "isSuccess": true,
            "responseData": undefined,
            "status": "success",
            "successfulRequestsCount": 1,
          },
        ],
        Array [
          Object {
            "data": Array [
              Object {
                "completed": false,
                "id": 1,
                "title": "todo 1",
              },
              Object {
                "completed": false,
                "id": 2,
                "title": "todo 2",
              },
            ],
            "dataUpdatedAt": 1577836801000,
            "fetchStatus": "idle",
            "isError": false,
            "isLoading": false,
            "isSuccess": true,
            "responseData": undefined,
            "status": "success",
            "successfulRequestsCount": 1,
          },
        ],
      ]
    `);
  });

  it('should cache response data', () => {
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));

    const { state, config } = createState(withEntities<Todo>());

    const store = new Store({ state, config, name: 'todos' });

    const entities$ = store.pipe(selectAllEntities());

    const spy = jest.fn();
    const subscribeSpy = jest.fn();

    entities$.subscribe((value) => {
      spy(value);
    });

    function getTodos() {
      return timer(1000).pipe(
        map(() => [createTodo(1)]),
        tap((todos) => store.update(setEntities(todos))),
        trackRequestResult(['todos'], { cacheResponseData: true }),
      );
    }

    getTodos().subscribe((value) => {
      subscribeSpy(value);
      expectTypeOf(value).toEqualTypeOf<Todo[]>();
    });
    getTodos().subscribe((value) => {
      subscribeSpy(value);
      expectTypeOf(value).toEqualTypeOf<Todo[]>();
    });

    jest.runAllTimers();

    expect(subscribeSpy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledTimes(2);

    getTodos().subscribe((value) => {
      subscribeSpy(value);
      expectTypeOf(value).toEqualTypeOf<Todo[]>();
    });

    jest.runAllTimers();

    // It's cached
    expect(subscribeSpy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenCalledTimes(2);

    expect(subscribeSpy.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          Array [
            Object {
              "completed": false,
              "id": 1,
              "title": "todo 1",
            },
          ],
        ],
        Array [
          Array [
            Object {
              "completed": false,
              "id": 1,
              "title": "todo 1",
            },
          ],
        ],
        Array [
          Array [
            Object {
              "completed": false,
              "id": 1,
              "title": "todo 1",
            },
          ],
        ],
      ]
    `);

    expect(spy.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          Array [],
        ],
        Array [
          Array [
            Object {
              "completed": false,
              "id": 1,
              "title": "todo 1",
            },
          ],
        ],
      ]
    `);
  });

  it('should skip cache', () => {
    jest.useFakeTimers();

    const { state, config } = createState(withEntities<Todo>());

    const store = new Store({ state, config, name: 'todos' });
    const reqSpy = jest.fn();

    function getTodos() {
      return timer(1000).pipe(
        map(() => [createTodo(1)]),
        tap(() => reqSpy()),
        tap((todos) => store.update(setEntities(todos))),
        trackRequestResult(['todos'], { skipCache: true }),
      );
    }

    getTodos().subscribe();

    jest.runAllTimers();

    expect(reqSpy).toHaveBeenCalledTimes(1);

    getTodos().subscribe();

    jest.runAllTimers();

    expect(reqSpy).toHaveBeenCalledTimes(2);
  });

  it('should skip prevent concurrent requests', () => {
    jest.useFakeTimers();

    const { state, config } = createState(withEntities<Todo>());

    const store = new Store({ state, config, name: 'todos' });
    const reqSpy = jest.fn();

    function getTodos() {
      return timer(1000).pipe(
        map(() => [createTodo(1)]),
        tap(() => reqSpy()),
        tap((todos) => store.update(setEntities(todos))),
        trackRequestResult(['todos'], { preventConcurrentRequest: false }),
      );
    }

    getTodos().subscribe();
    getTodos().subscribe();

    jest.runAllTimers();

    expect(reqSpy).toHaveBeenCalledTimes(2);

    getTodos().subscribe();

    jest.runAllTimers();

    expect(reqSpy).toHaveBeenCalledTimes(2);
  });

  it('should prevent concurrent requests when stale time is set', () => {
    jest.useFakeTimers();

    const { state, config } = createState(withEntities<Todo>());

    const store = new Store({ state, config, name: 'todos' });
    const reqSpy = jest.fn();

    function getTodos() {
      return timer(1000).pipe(
        map(() => [createTodo(1)]),
        tap(() => reqSpy()),
        tap((todos) => store.update(setEntities(todos))),
        trackRequestResult(['todos'], {
          staleTime: 900_000,
          preventConcurrentRequest: true,
        }),
      );
    }

    getTodos().subscribe();
    getTodos().subscribe();

    jest.runAllTimers();

    expect(reqSpy).toHaveBeenCalledTimes(1);

    getTodos().subscribe();

    jest.runAllTimers();

    expect(reqSpy).toHaveBeenCalledTimes(1);
  });

  it('should request when staleTime pass', () => {
    jest.useFakeTimers();

    const { state, config } = createState(withEntities<Todo>());

    const store = new Store({ state, config, name: 'todos' });
    const reqSpy = jest.fn();
    const entities$ = store.pipe(
      selectAllEntities(),
      joinRequestResult(['todos']),
    );

    const spy = jest.fn();

    entities$.subscribe((value) => {
      spy(value);
    });

    function getTodos() {
      return timer(1000).pipe(
        map(() => [createTodo(1)]),
        tap(() => reqSpy()),
        tap((todos) => store.update(setEntities(todos))),
        trackRequestResult(['todos'], { staleTime: 5000 }),
      );
    }

    getTodos().subscribe();

    jest.runAllTimers();

    expect(reqSpy).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(6000);
    getTodos().subscribe();
    jest.runAllTimers();

    expect(reqSpy).toHaveBeenCalledTimes(2);

    getTodos().subscribe();
    jest.runAllTimers();

    expect(reqSpy).toHaveBeenCalledTimes(2);

    jest.advanceTimersByTime(6000);
    getTodos().subscribe();
    jest.runAllTimers();

    expect(reqSpy).toHaveBeenCalledTimes(3);
  });

  it('should use additional cache keys', () => {
    jest.useFakeTimers();

    const { state, config } = createState(withEntities<Todo>());

    const store = new Store({ state, config, name: 'todos' });

    const spy = jest.fn();

    function getTodos() {
      return timer(1000).pipe(
        map(() => [createTodo(1)]),
        tap((todos) => store.update(setEntities(todos))),
        tap((todo) => spy(todo)),
        trackRequestResult(['todos'], {
          additionalKeys: (todos) => todos.map((todo) => ['todos', todo.id]),
        }),
      );
    }

    getTodos().subscribe();

    function getTodo(id: number) {
      return timer(1000).pipe(
        map(() => createTodo(id)),
        tap((todo) => store.update(upsertEntities([todo]))),
        tap((todo) => spy(todo)),
        trackRequestResult(['todos', id]),
      );
    }

    // Todos must have been fetched before caching can be done.
    timer(1000).subscribe(() => getTodo(1).subscribe());

    jest.runAllTimers();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should work with additional cache keys', () => {
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));

    const { state, config } = createState(withEntities<Todo>());

    const store = new Store({ state, config, name: 'todos' });

    function getEntity$(id: number) {
      return store.pipe(selectEntity(id), joinRequestResult(['todos', id]));
    }

    const spy = jest.fn();
    const reqSpy = jest.fn();
    const subscribeSpy = jest.fn();

    getEntity$(1).subscribe((value) => {
      spy(value);
    });

    function getTodos() {
      return timer(1000).pipe(
        map(() => [createTodo(1)]),
        tap(() => reqSpy()),
        tap((todos) => store.update(setEntities(todos))),
        trackRequestResult(['todos'], {
          additionalKeys: (todos) => todos.map((todo) => ['todos', todo.id]),
        }),
      );
    }

    getTodos().subscribe((value) => subscribeSpy(value));
    getTodos().subscribe((value) => subscribeSpy(value));

    jest.runAllTimers();

    expect(subscribeSpy).toHaveBeenCalledTimes(2);
    expect(reqSpy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should not cache aborted requests', () => {
    jest.useFakeTimers();

    const reqSpy = jest.fn();

    function get() {
      return new Observable((observer) => {
        const id = setTimeout(() => {
          observer.next();
          observer.complete();
        }, 1000);

        return () => {
          clearTimeout(id);
        };
      }).pipe(
        trackRequestResult(['todos']),
        tap(() => reqSpy()),
      );
    }

    const subscription = get().subscribe();
    subscription.unsubscribe();

    jest.runAllTimers();

    expect(reqSpy).toHaveBeenCalledTimes(0);

    // Next request should not be cached since the first one was aborted

    get().subscribe();

    jest.runAllTimers();

    expect(reqSpy).toHaveBeenCalledTimes(1);
  });
});
