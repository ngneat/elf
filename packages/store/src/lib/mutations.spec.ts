import { withProps } from './props.state';
import { createState } from './state';
import { Store } from './store';
import { setProp, setProps } from './mutations';

describe('mutations', () => {
  it('should set the prop', () => {
    const { state, config } = createState(
      withProps<{ filter: string }>({ filter: '' })
    );

    const store = new Store({ state, name: 'foo', config });

    store.update(setProp('filter', 'bar'));

    expect(store.getValue()).toMatchInlineSnapshot(`
      Object {
        "filter": "bar",
      }
    `);

    store.update(setProp('filter', (current) => current + 'baz'));

    expect(store.getValue()).toMatchInlineSnapshot(`
      Object {
        "filter": "barbaz",
      }
    `);

    // @ts-expect-error - Should be keyof
    store.update(setProp('nokey', 'bar'));

    // @ts-expect-error - Should be value type
    store.update(setProp('filter', 1));
  });

  it('should set the props', () => {
    const { state, config } = createState(
      withProps<{ nested: { a: string; b: number }; count: number }>({
        nested: { a: '', b: 1 },
        count: 0,
      })
    );

    const store = new Store({ state, name: 'foo', config });

    store.update(
      setProps({
        count: 1,
      })
    );

    expect(store.getValue()).toMatchInlineSnapshot(`
      Object {
        "count": 1,
        "nested": Object {
          "a": "",
          "b": 1,
        },
      }
    `);

    store.update(
      setProps((state) => {
        return {
          nested: {
            ...state.nested,
            b: 2,
          },
        };
      })
    );

    expect(store.getValue()).toMatchInlineSnapshot(`
      Object {
        "count": 1,
        "nested": Object {
          "a": "",
          "b": 2,
        },
      }
    `);

    store.update(
      setProps({
        // @ts-expect-error - Should be value type
        foo: 1,
      })
    );

    store.update(
      // @ts-expect-error - Should return value type
      setProps(() => {
        return {
          bar: 3,
        };
      })
    );
  });
});
