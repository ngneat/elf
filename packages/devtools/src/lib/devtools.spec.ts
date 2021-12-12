import { addEntities } from '@ngneat/elf-entities';
import { createEntitiesStore, createTodo } from '@ngneat/elf-mocks';
import { devTools } from './devtools';

describe('devtools', () => {
  const instanceMock = {
    init: jest.fn(),
    subscribe: jest.fn(),
    send: jest.fn(),
  };

  Object.defineProperty(global, 'window', {
    value: {
      __REDUX_DEVTOOLS_EXTENSION__: {
        connect: jest.fn().mockImplementation(() => instanceMock),
      },
    },
  });

  createEntitiesStore('books');

  devTools();

  it('should send actions', () => {
    // There should be support for stores that were created before we initialized the devTools
    expect(instanceMock.send).toHaveBeenCalledWith(
      { type: '[Books] - @Init' },
      {
        books: {
          entities: {},
          ids: [],
        },
      }
    );

    const store = createEntitiesStore();

    expect(instanceMock.send).toHaveBeenCalledWith(
      { type: '[Todos] - @Init' },
      {
        books: {
          entities: {},
          ids: [],
        },
        todos: {
          entities: {},
          ids: [],
        },
      }
    );

    store.update(addEntities(createTodo(1)));

    expect(instanceMock.send).toHaveBeenCalledWith(
      { type: '[Todos] - Update' },
      {
        books: {
          entities: {},
          ids: [],
        },
        todos: {
          entities: {
            1: {
              completed: false,
              id: 1,
              title: 'todo 1',
            },
          },
          ids: [1],
        },
      }
    );

    store.destroy();

    expect(instanceMock.send).toHaveBeenCalledWith(
      { type: 'Remove Todos' },
      {
        books: {
          entities: {},
          ids: [],
        },
      }
    );

    createEntitiesStore('foo');

    expect(instanceMock.send).toHaveBeenCalledWith(
      { type: '[Foo] - @Init' },
      {
        books: {
          entities: {},
          ids: [],
        },
        foo: {
          entities: {},
          ids: [],
        },
      }
    );

    const bar = createEntitiesStore('bar');

    expect(instanceMock.send).toHaveBeenCalledWith(
      { type: '[Bar] - @Init' },
      {
        books: {
          entities: {},
          ids: [],
        },
        foo: {
          entities: {},
          ids: [],
        },
        bar: {
          entities: {},
          ids: [],
        },
      }
    );

    bar.update(addEntities(createTodo(1)));

    expect(instanceMock.send).toHaveBeenCalledWith(
      { type: '[Bar] - Update' },
      {
        books: {
          entities: {},
          ids: [],
        },
        foo: {
          entities: {},
          ids: [],
        },
        bar: {
          entities: {
            1: {
              completed: false,
              id: 1,
              title: 'todo 1',
            },
          },
          ids: [1],
        },
      }
    );
  });
});
