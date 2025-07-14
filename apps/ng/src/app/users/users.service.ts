import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { trackRequestResult } from '@ngneat/elf-requests';
import { tap } from 'rxjs/operators';
import { User, UsersRepository } from './users.repository';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private http = inject(HttpClient);
  private usersRepo = inject(UsersRepository);

  getUsers() {
    return this.http
      .get<User[]>('https://jsonplaceholder.typicode.com/users')
      .pipe(
        tap((users) => this.usersRepo.setUsers(users)),
        trackRequestResult(['users']),
      );
  }

  getUser(id: string) {
    return this.http
      .get<User>(`https://jsonplaceholder.typicode.com/users/${id}`)
      .pipe(
        tap((user) => this.usersRepo.addUser(user)),
        trackRequestResult(['users', id]),
      );
  }
}
