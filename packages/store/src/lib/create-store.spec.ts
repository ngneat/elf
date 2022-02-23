import { withEntities } from '@ngneat/elf-entities';
import { Todo } from '@ngneat/elf-mocks';
import { expectTypeOf } from 'expect-type';
import { createStore } from './create-store';
import { withProps } from './props.state';
import { Store } from './store';

describe('createStore', () => {
  it('should create store', () => {
    const store = createStore(
      { name: 'todos' },
      withEntities<Todo>(),
      withProps<{ filter: string }>({ filter: '' })
    );

    expect(store.getValue()).toMatchSnapshot();
  });

  it('should error if wrong arguments are passed', () => {
    const store = createStore(
      // @ts-expect-error - The name property is missing
      {},
      withProps<{ filter: string }>({ filter: '' })
    );

    // @ts-expect-error - The state wasn't created with "asd" property
    store.update(() => ({ asd: 'foo' }));

    // @ts-expect-error - At least one argument of type PropsFactory<any, any> is expected
    createStore({ name: 'todos' });
  });

  it('should create object of Store type', () => {
    const store = createStore(
      { name: 'filter' },
      withProps<{ filter: string }>({ filter: '' })
    );

    type ExpectedType = Store<
      {
        name: string;
        state: { filter: string };
        config: undefined;
      },
      { filter: string }
    >;

    expectTypeOf(store).toEqualTypeOf<ExpectedType>();
  });
});
