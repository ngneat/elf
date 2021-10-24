import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { User, UsersRepository } from './users.repository';

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
        this.usersRepo.dataSource.trackRequestStatus(),
        this.usersRepo.dataSource.skipWhileCached()
      );
  }

  getUser(id: string) {
    return this.http
      .get<User>(`https://jsonplaceholder.typicode.com/users/${id}`)
      .pipe(
        tap((user) => this.usersRepo.addUser(user)),
        this.usersRepo.userDataSource.trackRequestStatus({ key: id }),
        this.usersRepo.userDataSource.skipWhileCached({ key: [id, 'users'] })
      );
  }
}
