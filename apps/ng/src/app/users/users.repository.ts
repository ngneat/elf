import {
  createState,
  selectAll,
  selectStatus,
  setEntities,
  Store,
  updateCache,
  withCache,
  withEntities,
  withStatus
} from '@ngneat/elf';
import {Injectable} from "@angular/core";

export interface User {
  id: number;
  name: string;
  email: string;
}

const {state, config} = createState(withEntities<User>(), withCache(), withStatus());
const store = new Store({name: 'users', state, config});

@Injectable({providedIn: 'root'})
export class UsersRepository {
  status$ = store.pipe(selectStatus());
  users$ = store.pipe(selectAll());

  get store() {
    return store;
  }

  setUsers(users: User[]) {
    store.reduce(setEntities(users), updateCache({users: 'full'}));
  }
}
