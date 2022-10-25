import { emitOnce, batchInProgress } from './batch';
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

  const v = emitOnce(() => {
    updateOne();
    store2.update((s) => ({ count: s.count + 1 }));
    store2.update((s) => ({ count: s.count + 1 }));

    return 10;
  });

  expect(v).toEqual(10);

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

test('batch loop', () => {
  const store = createStore(
    {
      name: 'todos2',
    },
    withProps<{ count: number }>({ count: 1 })
  );

  const spy = jest.fn();
  store.pipe(select((s) => s.count)).subscribe(spy);

  emitOnce(() => {
    for (let i = 0; i < 10; i++) {
      store.update((s) => ({ count: s.count + 1 }));
    }
  });

  expect(store.getValue()).toMatchInlineSnapshot(`
    Object {
      "count": 11,
    }
  `);

  expect(spy).toHaveBeenCalledTimes(2);
  expect(spy).toHaveBeenCalledWith(1);
  expect(spy).toHaveBeenCalledWith(11);
});

test('nested batch', () => {
  const store = createStore(
    {
      name: 'todos',
    },
    withProps<{ name: string; count: number }>({ name: 'foo', count: 1 })
  );

  const spy = jest.fn();
  store.pipe(select((s) => s.count)).subscribe(spy);

  expect(batchInProgress.getValue()).toBeFalsy();

  const v = emitOnce(() => {
    const count = emitOnce(() => {
      for (let i = 0; i < 10; i++) {
        store.update((s) => ({
          ...s,
          count: s.count + 1,
        }));
      }

      return 'count';
    });

    // should not stop batching after inner emitOnce
    expect(batchInProgress.getValue()).toBeTruthy();

    const name = emitOnce(() => {
      for (let i = 0; i < 10; i++) {
        store.update((s) => ({
          ...s,
          name: `foo${i + 1}`,
        }));
      }

      return 'name';
    });

    // should not stop batching after inner emitOnce
    expect(batchInProgress.getValue()).toBeTruthy();

    expect(count).toEqual('count');
    expect(name).toEqual('name');

    return `${name}-${count}`;
  });

  expect(batchInProgress.getValue()).toBeFalsy();

  expect(v).toEqual('name-count');

  expect(store.getValue()).toMatchInlineSnapshot(`
    Object {
      "count": 11,
      "name": "foo10",
    }
  `);

  expect(spy).toHaveBeenCalledTimes(2);
  expect(spy).toHaveBeenCalledWith(1);
  expect(spy).toHaveBeenCalledWith(11);
});
