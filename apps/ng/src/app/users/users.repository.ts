import { createState, Store } from '@ngneat/elf';
import {
  bindTrackRequestStatus,
  bindSkipWhileCached,
  selectRequestStatus,
  updateRequestCache,
  updateRequestStatus,
  withRequestsCache,
  withRequestsStatus,
} from '@ngneat/elf-requests';
import { Injectable } from '@angular/core';
import {
  addEntities,
  selectAll,
  selectEntity,
  setEntities,
  withEntities,
} from '@ngneat/elf-entities';

export interface User {
  id: number;
  name: string;
  email: string;
}

const { state, config } = createState(
  withEntities<User>(),
  withRequestsStatus(),
  withRequestsCache()
);
const store = new Store({ name: 'users', state, config });

@Injectable({ providedIn: 'root' })
export class UsersRepository {
  users$ = store.pipe(selectAll());
  status$ = store.pipe(selectRequestStatus('users'));

  trackUsersRequestsStatus = bindTrackRequestStatus<'users' | `user-${string}`>(
    store
  );
  skipWhileUsersCached = bindSkipWhileCached(store);

  user$(id: User['id']) {
    return store.pipe(selectEntity(id));
  }

  userStatus$(id: string) {
    return store.pipe(selectRequestStatus(id, { groupKey: 'users' }));
  }

  setUsers(users: User[]) {
    store.update(
      setEntities(users),
      updateRequestStatus('users', 'success'),
      updateRequestCache('users')
    );
  }

  addUser(user: User) {
    store.update(
      addEntities(user),
      updateRequestCache(user.id),
      updateRequestStatus(user.id, 'success')
    );
  }
}
