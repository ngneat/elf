import { createState, Store } from '@ngneat/elf';
import {
  withRequestsCache,
  withRequestsStatus,
  createRequestDataSource,
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
  dataSource = createRequestDataSource({
    store,
    data$: () => store.pipe(selectAll()),
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
