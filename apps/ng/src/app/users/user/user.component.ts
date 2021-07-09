import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../users.service';
import { switchMap, tap } from 'rxjs/operators';
import { UsersRepository } from '../users.repository';
import { MonoTypeOperatorFunction, Observable, of } from 'rxjs';

function effect<T>(
  cb: (data: T) => Observable<any>
): MonoTypeOperatorFunction<T> {
  return tap((...args) => cb(...args).subscribe());
}

@Component({
  template: `
    <h1>Status: {{ status$ | async }}</h1>

    <h1>User: {{ user$ | async | json }}</h1>
  `,
})
export class UserComponent {
  user$ = of(this.router.snapshot.params.id).pipe(
    effect((id) => this.usersService.getUser(id)),
    switchMap((id) => this.usersRepository.user$(id))
  );

  status$ = this.usersRepository.userStatus$(this.router.snapshot.params.id);

  constructor(
    private router: ActivatedRoute,
    private usersService: UsersService,
    private usersRepository: UsersRepository
  ) {}
}
