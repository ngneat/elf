import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {tap} from "rxjs/operators";
import {User, UsersRepository} from "./users.repository";
import {skipWhileCached} from "@ngneat/elf";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private http: HttpClient, private usersRepo: UsersRepository) {
  }

  getUsers() {
    return this.http.get<User[]>('https://jsonplaceholder.typicode.com/users').pipe(
      tap(users => this.usersRepo.setUsers(users)),
      skipWhileCached(this.usersRepo.store, 'users'),
    )
  }
}
