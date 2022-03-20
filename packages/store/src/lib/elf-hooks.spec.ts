import { createStore } from './create-store';
import { elfHooks, elfHooksRegistry } from './elf-hooks';
import { select } from './operators';
import { withProps } from './props.state';

describe('elfHooks', () => {
  describe('METHOD: registerPreStoreUpdate', () => {
    it('preStoreUpdate should be called if defined', () => {
      elfHooks.registerPreStoreUpdate(() => {
        return { filter: 'elf' };
      });

      const store = createStore(
        { name: 'todos' },
        withProps<{ filter: string }>({ filter: '' })
      );

      const spy = jest.spyOn(elfHooksRegistry, 'preStoreUpdate');

      store.update((s) => ({ ...s, filter: 'foo' }));

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        { filter: '' },
        { filter: 'foo' },
        'todos'
      );

      expect(store.getValue()).toMatchSnapshot();
    });

    it('registerPreStoreUpdate should be properly typed', () => {
      // @ts-expect-error - should prohibit void functions
      elfHooks.registerPreStoreUpdate(() => {
        console.log('void function');
      });
    });

    it('subscriber should emit only once', () => {
      elfHooks.registerPreStoreUpdate((_, currentState) => {
        return { num: currentState.num + 1 };
      });

      const store = createStore(
        { name: 'counter' },
        withProps<{ num: number }>({ num: 0 })
      );

      const spy = jest.fn();

      store.pipe(select((s) => s.num)).subscribe(spy);

      store.update((s) => ({ ...s, num: s.num + 1 }));

      expect(spy).toHaveBeenCalledTimes(2);
      expect(store.getValue().num).toBe(2);
    });
  });
});
