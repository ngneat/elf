import { createState, Store } from '@ngneat/elf';
import {
  addEntities,
  selectAllEntities,
  setEntities,
  withEntities,
} from '@ngneat/elf-entities';
import { createTodo, Todo } from '@ngneat/elf-mocks';
import { map, tap, timer } from 'rxjs';
import { joinRequestResult, trackRequestResult } from './requests-result';

describe('requests result', () => {
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

    // It's cached
    expect(spy).toHaveBeenCalledTimes(3);

    expect(spy.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "data": Array [],
            "error": undefined,
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
            "error": undefined,
            "isError": false,
            "isLoading": false,
            "isSuccess": true,
            "status": "idle",
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
            "error": undefined,
            "isError": false,
            "isLoading": false,
            "isSuccess": true,
            "status": "idle",
          },
        ],
      ]
    `);
  });
});
