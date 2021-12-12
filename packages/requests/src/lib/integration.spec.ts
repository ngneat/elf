import { createState, Store } from '@ngneat/elf';
import { withEntities, setEntities } from '@ngneat/elf-entities';
import { mapTo, tap, timer } from 'rxjs';
import {
  withRequestsCache,
  withRequestsStatus,
  createRequestsCacheOperator,
  createRequestsStatusOperator,
  updateRequestCache,
  selectRequestCache,
  selectRequestStatus,
  updateRequestStatus,
} from '..';

test('intergation', () => {
  jest.useFakeTimers();

  interface Todo {
    id: number;
    label: string;
  }

  const { state, config } = createState(
    withEntities<Todo>(),
    withRequestsCache<'todos'>(),
    withRequestsStatus()
  );

  const todosStore = new Store({ name: 'todos', state, config });
  const skipWhileTodosCached = createRequestsCacheOperator(todosStore);
  const trackTodosRequestsStatus = createRequestsStatusOperator(todosStore);

  function setTodos(todos: Todo[]) {
    todosStore.update(
      updateRequestStatus('todos', 'success'),
      updateRequestCache('todos'),
      setEntities(todos)
    );
  }

  const cacheSpy = jest.fn();
  const requestSpy = jest.fn();
  const fetchSpy = jest.fn();

  todosStore.pipe(selectRequestCache('todos')).subscribe((status) => {
    cacheSpy(status.value);
  });

  todosStore.pipe(selectRequestStatus('todos')).subscribe((status) => {
    requestSpy(status.value);
  });

  expect(cacheSpy).toHaveBeenCalledTimes(1);
  expect(cacheSpy).toBeCalledWith('none');

  expect(requestSpy).toHaveBeenCalledTimes(1);
  expect(requestSpy).toBeCalledWith('idle');

  function fetchTodos() {
    return timer(1000).pipe(
      mapTo([]),
      tap(setTodos),
      trackTodosRequestsStatus('todos'),
      skipWhileTodosCached('todos')
    );
  }

  fetchTodos().subscribe(fetchSpy);

  expect(requestSpy).toHaveBeenCalledTimes(2);
  expect(requestSpy).toBeCalledWith('pending');

  jest.runAllTimers();

  expect(fetchSpy).toHaveBeenCalledTimes(1);
  expect(cacheSpy).toHaveBeenCalledTimes(2);
  expect(cacheSpy).toBeCalledWith('full');

  expect(requestSpy).toHaveBeenCalledTimes(3);
  expect(requestSpy).toBeCalledWith('success');

  // Use `setTimeout` to simulate a later call
  setTimeout(() => {
    fetchTodos().subscribe(() => console.log('You should not see me'));
  }, 1000);

  jest.runAllTimers();
  expect(cacheSpy).toHaveBeenCalledTimes(2);
  expect(requestSpy).toHaveBeenCalledTimes(3);
  expect(fetchSpy).toHaveBeenCalledTimes(1);
});
