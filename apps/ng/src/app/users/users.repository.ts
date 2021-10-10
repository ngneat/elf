import { createState, Store } from '@ngneat/elf';
import {
  selectRequestStatus,
  updateRequestCache,
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

export const enum UsersRequests {
  default = 'users',
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
    return store.pipe(
      selectRequestStatus(id, { groupKey: UsersRequests.default })
    );
  }

  get store() {
    return store;
  }

  setUsers(users: User[]) {
    store.update(setEntities(users), updateRequestCache(UsersRequests.default));
  }

  addUser(user: User) {
    this.store.update(addEntities(user), updateRequestCache(user.id));
  }
}
