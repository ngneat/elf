import { Subject, map } from 'rxjs';
import {
  emitOnce,
  batchInProgress,
  emitOnceAsync,
  asyncBatchesInProgress,
} from './batch';
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

test('async batch', async () => {
  const store = createStore(
    {
      name: 'todos',
    },
    withProps<{ name: string; count: number }>({ name: 'foo', count: 1 })
  );

  const spy = jest.fn();
  store.pipe(select((s) => s.count)).subscribe(spy);

  expect(batchInProgress.getValue()).toBeFalsy();
  expect(asyncBatchesInProgress).toBe(0);

  const deferred = new Deferred();

  const v = emitOnceAsync(async () => {
    for (let i = 0; i < 10; i++) {
      store.update((s) => ({
        ...s,
        count: s.count + 1,
      }));
    }

    await deferred.promise;
    console.log('after await');
  });

  expect(batchInProgress.getValue()).toBeTruthy();
  expect(asyncBatchesInProgress).toBe(1);

  deferred.resolve(void 0);
  await v;

  expect(batchInProgress.getValue()).toBeFalsy();
  expect(asyncBatchesInProgress).toBe(0);

  expect(spy).toHaveBeenCalledTimes(2);
  expect(spy).toHaveBeenCalledWith(1);
  expect(spy).toHaveBeenCalledWith(11);
});

test('nested async batch resolve 1 then 2', async () => {
  const store = createStore(
    {
      name: 'todos',
    },
    withProps<{ name: string; count: number }>({ name: 'foo', count: 1 })
  );

  const spy = jest.fn();
  store.pipe(select((s) => s.count)).subscribe(spy);

  expect(batchInProgress.getValue()).toBeFalsy();
  expect(asyncBatchesInProgress).toBe(0);

  const deferred1 = new Deferred();
  const deferred2 = new Deferred();

  const v = emitOnceAsync(async () => {
    for (let i = 0; i < 10; i++) {
      store.update((s) => ({
        ...s,
        count: s.count + 1,
      }));
    }

    await emitOnceAsync(async () => {
      for (let i = 0; i < 10; i++) {
        store.update((s) => ({
          ...s,
          count: s.count + 1,
        }));
      }

      await deferred2.promise;
    });

    await deferred1.promise;
  });

  expect(batchInProgress.getValue()).toBeTruthy();
  expect(asyncBatchesInProgress).toBe(2);

  deferred1.resolve(void 0);
  await deferred1.promise; // wait for the first deferred to resolve
  expect(batchInProgress.getValue()).toBeTruthy();
  deferred2.resolve(void 0);

  await v;

  expect(batchInProgress.getValue()).toBeFalsy();
  expect(asyncBatchesInProgress).toBe(0);

  expect(spy).toHaveBeenCalledTimes(2);
  expect(spy).toHaveBeenCalledWith(1);
  expect(spy).toHaveBeenCalledWith(21);
});

test('nested async batch resolve 2 then 1', async () => {
  const store = createStore(
    {
      name: 'todos',
    },
    withProps<{ name: string; count: number }>({ name: 'foo', count: 1 })
  );

  const spy = jest.fn();
  store.pipe(select((s) => s.count)).subscribe(spy);

  expect(batchInProgress.getValue()).toBeFalsy();
  expect(asyncBatchesInProgress).toBe(0);

  const deferred1 = new Deferred();
  const deferred2 = new Deferred();

  const v = emitOnceAsync(async () => {
    for (let i = 0; i < 10; i++) {
      store.update((s) => ({
        ...s,
        count: s.count + 1,
      }));
    }

    await emitOnceAsync(async () => {
      for (let i = 0; i < 10; i++) {
        store.update((s) => ({
          ...s,
          count: s.count + 1,
        }));
      }

      await deferred2.promise;
    });

    await deferred1.promise;
  });

  expect(batchInProgress.getValue()).toBeTruthy();
  expect(asyncBatchesInProgress).toBe(2);

  deferred2.resolve(void 0);
  await deferred2.promise; // wait for the second deferred to resolve
  expect(batchInProgress.getValue()).toBeTruthy();
  deferred1.resolve(void 0);

  await v;

  expect(batchInProgress.getValue()).toBeFalsy();
  expect(asyncBatchesInProgress).toBe(0);

  expect(spy).toHaveBeenCalledTimes(2);
  expect(spy).toHaveBeenCalledWith(1);
  expect(spy).toHaveBeenCalledWith(21);
});

test('nested batch in async batch', async () => {
  const store = createStore(
    {
      name: 'todos',
    },
    withProps<{ name: string; count: number }>({ name: 'foo', count: 1 })
  );

  const spy = jest.fn();
  store.pipe(select((s) => s.count)).subscribe(spy);

  expect(batchInProgress.getValue()).toBeFalsy();
  expect(asyncBatchesInProgress).toBe(0);

  const deferred = new Deferred();

  const v = emitOnceAsync(async () => {
    for (let i = 0; i < 10; i++) {
      store.update((s) => ({
        ...s,
        count: s.count + 1,
      }));
    }

    emitOnce(async () => {
      for (let i = 0; i < 10; i++) {
        store.update((s) => ({
          ...s,
          count: s.count + 1,
        }));
      }
    });

    await deferred.promise;
  });

  expect(batchInProgress.getValue()).toBeTruthy();
  expect(asyncBatchesInProgress).toBe(1);

  deferred.resolve(void 0);

  await v;

  expect(batchInProgress.getValue()).toBeFalsy();
  expect(asyncBatchesInProgress).toBe(0);

  expect(spy).toHaveBeenCalledTimes(2);
  expect(spy).toHaveBeenCalledWith(1);
  expect(spy).toHaveBeenCalledWith(21);
});

test('async batch with observable', async () => {
  const store = createStore(
    {
      name: 'todos',
    },
    withProps<{ name: string; count: number }>({ name: 'foo', count: 1 })
  );

  const spy = jest.fn();
  store.pipe(select((s) => s.count)).subscribe(spy);

  expect(batchInProgress.getValue()).toBeFalsy();
  expect(asyncBatchesInProgress).toBe(0);

  const obs$ = new Subject<void>();

  const v = emitOnceAsync(() => obs$.pipe(map(() => {
    for (let i = 0; i < 10; i++) {
      store.update((s) => ({
        ...s,
        count: s.count + 1,
      }));
    }
  })));


  expect(batchInProgress.getValue()).toBeTruthy();
  expect(asyncBatchesInProgress).toBe(1);

  obs$.next();

  await v;

  expect(batchInProgress.getValue()).toBeFalsy();
  expect(asyncBatchesInProgress).toBe(0);

  expect(spy).toHaveBeenCalledTimes(2);
  expect(spy).toHaveBeenCalledWith(1);
  expect(spy).toHaveBeenCalledWith(11);
});

class Deferred {
  public promise: Promise<unknown>;
  public resolve!: (value: unknown) => void;
  public reject!: (reason?: any) => void;
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.reject = reject;
      this.resolve = resolve;
    });
  }
}
