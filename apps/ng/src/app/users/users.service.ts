import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { User, UsersRepository, UsersRequests } from './users.repository';
import { trackRequestStatus, skipWhileCached } from '@ngneat/elf-requests';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient, private usersRepo: UsersRepository) {}

  getUsers() {
    return this.http
      .get<User[]>('https://jsonplaceholder.typicode.com/users')
      .pipe(
        tap((users) => this.usersRepo.setUsers(users)),
        trackRequestStatus(this.usersRepo.store, UsersRequests.default),
        skipWhileCached(this.usersRepo.store, UsersRequests.default)
      );
  }

  getUser(id: string) {
    return this.http
      .get<User>(`https://jsonplaceholder.typicode.com/users/${id}`)
      .pipe(
        tap((user) => this.usersRepo.addUser(user)),
        trackRequestStatus(this.usersRepo.store, id),
        skipWhileCached(this.usersRepo.store, [id, UsersRequests.default])
      );
  }
}
