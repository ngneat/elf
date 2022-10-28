import { createState, Store } from '@ngneat/elf';
import {
  addEntities,
  selectAllEntities,
  setEntities,
  withEntities,
} from '@ngneat/elf-entities';
import { createTodo, Todo } from '@ngneat/elf-mocks';
import { map, tap, timer } from 'rxjs';
import {
  clearRequestsResult,
  joinRequestResult,
  trackRequestResult,
} from './requests-result';

describe('requests result', () => {
  afterEach(() => {
    clearRequestsResult();
  });

  it('should work', () => {
    jest.useFakeTimers();

    const { state, config } = createState(withEntities<Todo>());

    const store = new Store({ state, config, name: 'todos' });

    const entities$ = store.pipe(
      selectAllEntities(),
      joinRequestResult(['todos'])
    );

    const spy = jest.fn();

    entities$.subscribe((value) => {
      spy(value);
    });

    function getTodos() {
      return timer(1000).pipe(
        map(() => [createTodo(1)]),
        tap((todos) => store.update(setEntities(todos))),
        trackRequestResult(['todos'])
      );
    }

    getTodos().subscribe();

    jest.runAllTimers();

    expect(spy).toHaveBeenCalledTimes(2);

    store.update(addEntities(createTodo(2)));

    expect(spy).toHaveBeenCalledTimes(3);
    getTodos().subscribe();

    jest.runAllTimers();

    // It's cached
    expect(spy).toHaveBeenCalledTimes(3);

    expect(spy.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "data": Array [],
            "isError": false,
            "isLoading": true,
            "isSuccess": false,
            "status": "loading",
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
            "isError": false,
            "isLoading": false,
            "isSuccess": true,
            "status": "success",
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
            "isError": false,
            "isLoading": false,
            "isSuccess": true,
            "status": "success",
          },
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
        tap((todos) => reqSpy() && store.update(setEntities(todos))),
        trackRequestResult(['todos'], { skipCache: true })
      );
    }

    getTodos().subscribe();

    jest.runAllTimers();

    expect(reqSpy).toHaveBeenCalledTimes(1);

    getTodos().subscribe();

    jest.runAllTimers();

    expect(reqSpy).toHaveBeenCalledTimes(2);
  });

  it('should request when staleTime pass', () => {
    jest.useFakeTimers();

    const { state, config } = createState(withEntities<Todo>());

    const store = new Store({ state, config, name: 'todos' });
    const reqSpy = jest.fn();

    function getTodos() {
      return timer(1000).pipe(
        map(() => [createTodo(1)]),
        tap((todos) => reqSpy() && store.update(setEntities(todos))),
        trackRequestResult(['todos'], { staleTime: 5000 })
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
});
