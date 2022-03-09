import { createStore } from '@ngneat/elf';
import { expectTypeOf } from 'expect-type';
import { selectAllEntities, selectEntities, withEntities } from '..';
import { addEntities } from './add.mutation';
import { entitiesPropsFactory } from './entity.state';

const { cartEntitiesRef, withCartEntities } = entitiesPropsFactory('cart');

describe('entities props factory', () => {
  it('should create entities', () => {
    const store = createStore(
      { name: 'todos' },
      withCartEntities<{ title: string; id: number }>()
    );

    store.update(
      addEntities({ id: 1, title: 'foo' }, { ref: cartEntitiesRef })
    );

    expect(store.getValue()).toMatchSnapshot();
  });

  it('should work with the default entities', () => {
    const store = createStore(
      { name: 'todos' },
      withEntities<{ id: string; label: string }>(),
      withCartEntities<{ title: string; id: number }>()
    );

    store.update(
      addEntities({ id: '1', label: 'foo' }),
      addEntities({ id: 1, title: 'foo' }, { ref: cartEntitiesRef })
    );

    expect(store.getValue()).toMatchSnapshot();

    expectTypeOf(store.getValue()).toEqualTypeOf<{
      entities: Record<
        string,
        {
          id: string;
          label: string;
        }
      >;
      ids: string[];
      cartEntities: Record<
        number,
        {
          title: string;
          id: number;
        }
      >;
      cartIds: number[];
    }>();
  });

  it('should infer types', () => {
    const store = createStore(
      { name: 'todos' },
      withCartEntities<{ title: string; id: number }>()
    );

    expectTypeOf(store.getValue()).toEqualTypeOf<{
      cartEntities: Record<
        number,
        {
          title: string;
          id: number;
        }
      >;
      cartIds: number[];
    }>();

    try {
      store.update(
        // @ts-expect-error - The deault entities isn't declared
        addEntities({ id: '1', label: 'foo' }),
        addEntities({ id: 1, title: 'foo' }, { ref: cartEntitiesRef })
      );
    } catch {
      //
    }

    store.update(
      // @ts-expect-error - id should be a number
      addEntities({ id: '1', title: 'foo' }, { ref: cartEntitiesRef }),
      // @ts-expect-error - nope isn't exists on type of cart entity
      addEntities({ id: 1, title: 'foo', nope: '' }, { ref: cartEntitiesRef })
    );
  });

  it('should work with multiple', () => {
    interface Actor {
      id: string;
      name: string;
    }

    interface Genre {
      id: string;
      name: string;
    }

    interface Movie {
      id: string;
      title: string;
      genres: Array<Genre['id']>;
      actors: Array<Actor['id']>;
    }

    const { actorsEntitiesRef, withActorsEntities } =
      entitiesPropsFactory('actors');
    const { genresEntitiesRef, withGenresEntities } =
      entitiesPropsFactory('genres');

    const store = createStore(
      { name: 'movies' },
      withEntities<Movie>(),
      withGenresEntities<Genre>(),
      withActorsEntities<Actor>()
    );

    expect(store.getValue()).toMatchSnapshot();

    const spy = jest.fn();

    store
      .combine({
        movies: store.pipe(selectAllEntities()),
        generes: store.pipe(selectEntities({ ref: genresEntitiesRef })),
        actors: store.pipe(selectEntities({ ref: actorsEntitiesRef })),
      })
      .subscribe((v) => {
        spy(v);

        expectTypeOf(v).toEqualTypeOf<{
          movies: Movie[];
          generes: Record<string, Genre>;
          actors: Record<string, Actor>;
        }>();
      });

    expect(spy).toHaveBeenCalledTimes(1);

    store.update(
      addEntities({ id: '1', name: 'foo' }, { ref: actorsEntitiesRef }),
      addEntities({ id: '1', name: 'foo' }, { ref: genresEntitiesRef }),
      addEntities({ id: '1', title: 'one', genres: ['1'], actors: ['1'] })
    );

    expect(store.getValue()).toMatchSnapshot();

    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should allow initial value', () => {
    const { withFooEntities, fooEntitiesRef } = entitiesPropsFactory('foo');

    const store = createStore(
      { name: 'foo' },
      withFooEntities<{ id: number; count: number }>({
        initialValue: [
          {
            id: 1,
            count: 0,
          },
        ],
      })
    );

    expect(store.getValue()).toMatchInlineSnapshot(`
      Object {
        "fooEntities": Object {
          "1": Object {
            "count": 0,
            "id": 1,
          },
        },
        "fooIds": Array [
          1,
        ],
      }
    `);

    store.update(addEntities({ id: 2, count: 1 }, { ref: fooEntitiesRef }));

    expect(store.getValue()).toMatchInlineSnapshot(`
      Object {
        "fooEntities": Object {
          "1": Object {
            "count": 0,
            "id": 1,
          },
          "2": Object {
            "count": 1,
            "id": 2,
          },
        },
        "fooIds": Array [
          1,
          2,
        ],
      }
    `);
  });
});
