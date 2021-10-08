import {
  createState,
  EmptyConfig,
  PropsFactory,
  Reducer,
  select,
  Store,
  withProps,
} from '../index';
import { expectTypeOf } from 'expect-type';

interface Props {
  id: number;
  name: string;
}

interface FooProps {
  foo: string;
}

function withFoo(): PropsFactory<FooProps, EmptyConfig> {
  return {
    props: {
      foo: '',
    },
    config: undefined,
  };
}

describe('Store types', () => {
  it('should set the correct types', () => {
    const { state, config } = createState(
      withProps<Props>({ id: 1, name: 'foo' }),
      withFoo()
    );

    expectTypeOf(state).toEqualTypeOf<Props & FooProps>();
    expectTypeOf(config).toEqualTypeOf<EmptyConfig>();

    const store = new Store({ state, config, name: 'foo' });

    expectTypeOf(store.getValue()).toEqualTypeOf<Props & FooProps>();

    expectTypeOf(store.update)
      .parameter(0)
      .toEqualTypeOf<Reducer<Props & FooProps>>();

    store.subscribe((state) => {
      expectTypeOf(state).toEqualTypeOf<Props & FooProps>();
    });

    store
      .combine({
        id: store.pipe(select((state) => state.id)),
        name: store.pipe(select((state) => state.name)),
      })
      .subscribe((v) => {
        expectTypeOf(v).toEqualTypeOf<Props>();
      });

    try {
      store.combine({
        // @ts-expect-error - Should be an observable
        foo: 1,
      });
    } catch {
      //
    }
  });
});
