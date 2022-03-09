import { Injectable } from '@angular/core';
import { createStore } from '@ngneat/elf';
import {
  addEntities,
  selectAllEntities,
  selectEntity,
  setEntities,
  withEntities,
} from '@ngneat/elf-entities';
import {
  createRequestDataSource,
  withRequestsCache,
  withRequestsStatus,
} from '@ngneat/elf-requests';

export interface User {
  id: number;
  name: string;
  email: string;
}

const store = createStore(
  { name: 'users' },
  withEntities<User>(),
  withRequestsStatus(),
  withRequestsCache()
);

@Injectable({ providedIn: 'root' })
export class UsersRepository {
  dataSource = createRequestDataSource({
    store,
    data$: () => store.pipe(selectAllEntities()),
    requestKey: 'users',
    dataKey: 'users',
  });

  userDataSource = createRequestDataSource({
    store,
    data$: (key: number) => store.pipe(selectEntity(key)),
    dataKey: 'user',
    requestStatusOptions: { groupKey: 'users' },
  });

  setUsers(users: User[]) {
    store.update(
      setEntities(users),
      this.dataSource.setSuccess(),
      this.dataSource.setCached()
    );
  }

  addUser(user: User) {
    store.update(
      addEntities(user),
      this.userDataSource.setSuccess({ key: user.id }),
      this.userDataSource.setCached({ key: user.id })
    );
  }
}
