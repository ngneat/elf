import {
  addEntities,
  createState,
  requestsStateForEntities,
  selectAll,
  selectEntity,
  selectRequestStatus,
  setEntities,
  Store,
  updateRequestsCache,
  updateRequestsStatus,
  withEntities,
  withRequestsCache,
  withRequestsStatus,
} from '@ngneat/elf';
import { Injectable } from '@angular/core';

export interface User {
  id: number;
  name: string;
  email: string;
}

export const enum UsersRequests {
  default = 'users',
  user = 'user',
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
  status$ = store.pipe(selectRequestStatus(UsersRequests.default));

  user$(id: User['id']) {
    return store.pipe(selectEntity(id));
  }

  userStatus$(id: string) {
    return store.pipe(selectRequestStatus(id));
  }

  get store() {
    return store;
  }

  setUsers(users: User[]) {
    const { cache, status } = requestsStateForEntities(users);
    store.reduce(
      setEntities(users),
      updateRequestsCache({ users: 'full', ...cache }),
      updateRequestsStatus(status)
    );
  }

  addUser(user: User) {
    this.store.reduce(
      addEntities(user),
      updateRequestsCache({ [user.id]: 'full' })
    );
  }
}
