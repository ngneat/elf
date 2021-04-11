import { createState } from '../core/state';
import { withProps } from './props.state';
import { Store } from '@eleanor/store';

type Props = {
  filter: 'hey' | 'bye';
}

describe('withProps', () => {
  const { state, config } = createState(
    withProps<Props>({ filter: 'bye' })
  );

  const store = new Store({ state, name: 'todos', config });

  it('should', () => {
    store.subscribe(console.log);

    store.reduce(state => ({
      filter: 'hey'
    }))
  });

});
