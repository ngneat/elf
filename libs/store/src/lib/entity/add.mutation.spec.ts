import { createState } from '../core/state';
import { withProps } from '../props/props.state';
import { Reducer, Store } from '@eleanor/store';
import { withEntities } from './entity.state';
import { addEntity } from './add.mutation';
import { removeEntity } from './remove.mutation';
import { updateEntity } from './update.mutation';
import { withStatus } from '../status/status.state';
import { setStatus } from '../status/status.mutation';
import { withActive } from '../active/active.state';
import { setActive } from '../active/active.mutation';
import { selectStatus } from '../status/status.query';
import { selectActive } from '../active/active.query';
import { head } from '../core/queries';
import { selectAll } from './all.query';
import { selectEntity } from './entity.query';
import { selectFirst } from './first.query';
import { selectLast } from './last.query';
import { selectMany } from './many.query';
import { setCached } from '../cache/cache.mutation';
import { withCache } from '../cache/cache.state';
import { selectCache } from '../cache/cache.query';
import { selectEntityCache } from '../entity-cache/entity-cache.query';
import { withEntityCache } from '../entity-cache/entity-cache.state';
import { setEntityCache } from '../entity-cache/entity-cache.mutation';
import { withError } from '../error/error.state';
import { setError } from '../error/error.mutation';
import { selectError } from '../error/error.query';
import { withEntityStatus } from '../entity-status/entity-status.state';
import { selectEntityStatus } from '../entity-status/entity-status.query';
import { setEntityStatus } from '../entity-status/entity-status.mutation';

type Props = {
  filter: 'hey' | 'bye';
}

type Todo = {
  id: string;
  completed?: boolean;
  title: string;
}

describe('withProps', () => {
  const { state, config } = createState(
    withProps<Props>({ filter: 'bye' }),
    withEntities<Todo, Todo['id']>(),
    withStatus(),
    withActive<Todo['id']>(),
    withCache(),
    withEntityCache<Todo['id']>(),
    withError<string>(),
    withEntityStatus<Todo['id']>()
  );

  function updateFilter<S extends Props>(filter: S['filter']): Reducer<typeof state> {
    return state => {
      return {
        ...state,
        filter
      };
    };
  }

  const store = new Store({ state, name: 'todos', config });

  it('should', () => {
    // store.subscribe(console.log);
    //
    // store.reduce(state => ({
    //   ...state,
    //   filter: 'hey'
    // }));
    //
    // store.pipe(selectStatus()).subscribe(v => {
    //   console.log('status', v);
    // })
    //
    // store.pipe(selectActive(), head()).subscribe(v => {
    //   console.log('active', v);
    // })
    //
    // store.pipe(selectAll()).subscribe(v => {
    //   console.log('selectAll', v);
    // })
    //
    // store.pipe(selectEntity('3')).subscribe(v => {
    //   console.log('selectEntity', v);
    // })
    //
    // store.pipe(selectEntity('3', todo => todo.title)).subscribe(v => {
    //   console.log('selectEntity cb', v);
    // })
    //
    // store.pipe(selectEntity('3', 'title')).subscribe(v => {
    //   console.log('selectEntity key', v);
    // })
    //
    // store.pipe(selectFirst()).subscribe(v => {
    //   console.log('selectFirst', v);
    // })
    //
    // store.pipe(selectLast()).subscribe(v => {
    //   console.log('selectLast', v);
    // })
    //
    // store.pipe(selectMany(['3'])).subscribe(v => {
    //   console.log('selectMany', v);
    // })
    //
    // store.pipe(selectMany(['3'], todo => todo.title)).subscribe(v => {
    //   console.log('selectMany prop', v);
    // })

    // store.pipe(selectCache()).subscribe(v => {
    //   console.log('selectCache', v);
    // })
    //
    // store.pipe(selectEntityCache('3')).subscribe(v => {
    //   console.log('selectEntityCache', v);
    // })
    //
    // store.pipe(selectError()).subscribe(v => {
    //   console.log('selectError', v);
    // })

    store.pipe(selectEntityStatus('3')).subscribe(v => {
      console.log('selectEntityStatus', v);
    })

    store.reduce(state => ({
      ...state,
      filter: 'hey'
    }));

    store.reduce(
      addEntity({ id: '1', title: 'hey' }),
      addEntity({ id: '2', title: 'hey' }, { prepend: true }),
      removeEntity('1'),
      updateFilter('bye'),
      setEntityStatus('3', 'pending'),
      updateEntity(['2'], entity => ({
        ...entity,
        title: 'foo'
      })),
      updateEntity('2', { title: 'boo' }),
      setStatus('success'),
      setActive(['1','3']),
      setCached(true),
      setEntityCache('3'),
      setError('there was an error'),
      updateEntity(['3', '2'], entity => ({
        ...entity,
        title: 'voo'
      }), {
        createFactory(id, newState: any) {
          return {
            id,
           ...newState,
            completed: false,
          } as any
        }
      })
    );

    store.reduce(setEntityCache('3', 'empty'))

    // store.reduce(addEntity({ id: '3', title: 'foo'}, { overwrite: true }));
    // store.reduce(removeEntity('2'))
  });

});
