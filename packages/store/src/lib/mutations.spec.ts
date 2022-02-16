import { withProps } from './props.state';
import { createState } from './state';
import { Store } from './store';
import { setProp } from './mutations';

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
});
