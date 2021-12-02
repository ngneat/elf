import { createState, select, Store, withProps } from '..';

type Props = {
  filter: string;
  counter: number;
};

test('stale emission demo', async () => {
  const { state, config } = createState(
    withProps<Props>({ filter: '', counter: 0 })
  );
  const store = new Store({ state, config, name: 'stale' });

  const filter$ = store.pipe(select(({ filter }) => filter));
  const counter$ = store.pipe(select(({ counter }) => counter));

  // Subscribe to filter and update counter
  // FIRST SUBSCRIBER
  filter$.subscribe(() => {
    store.update((state) => ({
      ...state,
      counter: state.counter + 1,
    }));
  });

  // Subcribe to counter in the component
  // SECONED SUBSCRIBER
  counter$.subscribe((counter) => {
    console.log(counter);
  });

  // Simulate a click
  await new Promise((res) => setTimeout(res, 0));

  // Update the filter
  store.update((state) => ({
    ...state,
    filter: 'new',
  }));
});

// Why do we see the values 1 2 1?

// When we update the filter it first passes to FIRST SUBSCRIBER which updates the `counter` property.
// The SECOND SUBSCRIBER receives this emission and logs the value *2*.
// But the SECOND SUBSCRIBER will still receive the value *1*, since the emission of the filter update is still in the pipeline with a **staled** state.

// There are two ways to get around this issue:
// 1. Change the subscriptions order - SECONED SUBSCRIBER and then FIRST SUBSCRIBER
// 2. Delay the FIRST SUBSCRIBER update using one of RxJS operators. (e.g auditTime(0))
