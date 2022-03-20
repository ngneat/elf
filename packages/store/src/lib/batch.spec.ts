import { emitOnce } from './batch';
import { createStore } from './create-store';
import { select } from './operators';
import { withProps } from './props.state';

test('batch', () => {
  const store = createStore(
    {
      name: 'todos',
    },
    withProps<{ count: number }>({ count: 1 })
  );

  const store2 = createStore(
    {
      name: 'todos2',
    },
    withProps<{ count: number }>({ count: 1 })
  );

  const spy = jest.fn();
  const spy2 = jest.fn();

  function updateOne() {
    store.update((s) => ({ count: s.count + 1 }));
    store.update((s) => ({ count: s.count + 1 }));
  }

  store.pipe(select((s) => s.count)).subscribe(spy);
  store2.pipe(select((s) => s.count)).subscribe(spy2);

  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy2).toHaveBeenCalledTimes(1);

  emitOnce(() => {
    updateOne();
    store2.update((s) => ({ count: s.count + 1 }));
    store2.update((s) => ({ count: s.count + 1 }));
  });

  expect(spy).toHaveBeenCalledTimes(2);

  expect(store.getValue()).toMatchInlineSnapshot(`
    Object {
      "count": 3,
    }
  `);

  expect(spy2).toHaveBeenCalledTimes(2);

  expect(store2.getValue()).toMatchInlineSnapshot(`
    Object {
      "count": 3,
    }
  `);
});
