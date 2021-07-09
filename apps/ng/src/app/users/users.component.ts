import { Component } from '@angular/core';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { MonoTypeOperatorFunction, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

function effect<T>(
  cb: (data: T) => Observable<any>
): MonoTypeOperatorFunction<T> {
  return tap((...args) => cb(...args).subscribe());
}

@Component({
  selector: 'elf-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent {
  users$ = this.usersRepo.users$.pipe(
    effect(() => this.usersService.getUsers())
  );
  status$ = this.usersRepo.status$;

  constructor(
    private usersRepo: UsersRepository,
    private usersService: UsersService
  ) {}
}
