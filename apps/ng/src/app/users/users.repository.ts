import { Injectable } from '@angular/core';
import { createStore } from '@ngneat/elf';
import {
  selectAllEntities,
  selectEntity,
  setEntities,
  upsertEntities,
  withEntities,
} from '@ngneat/elf-entities';
import { joinRequestResult } from '@ngneat/elf-requests';

export interface User {
  id: number;
  name: string;
  email: string;
}

const store = createStore({ name: 'users' }, withEntities<User>());

@Injectable({ providedIn: 'root' })
export class UsersRepository {
  users$ = store.pipe(selectAllEntities(), joinRequestResult(['users']));

  getUser(id: User['id']) {
    return store.pipe(selectEntity(id), joinRequestResult(['users', id]));
  }

  setUsers(users: User[]) {
    store.update(setEntities(users));
  }

  addUser(user: User) {
    store.update(upsertEntities(user));
  }
}
