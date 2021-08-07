import { Component } from '@angular/core';
import { ContactsService } from './state/contacts.service';
import { generatePages } from './contacts-data';
import { ContactsRepository } from './state/contacts.repository';
import { map, startWith, switchMap } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'elf-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css'],
})
export class ContactsComponent {
  data$ = combineLatest({
    contacts: this.repo.activePageContacts$,
    status: this.repo.status$,
    indicators: this.repo.activePage$.pipe(
      switchMap((page) =>
        this.service
          .getContacts(page)
          .pipe(map((c) => generatePages(c.total, c.perPage)))
      ),
      startWith([])
    ),
  });

  constructor(
    private service: ContactsService,
    private repo: ContactsRepository
  ) {}

  updateActivePage(page: number) {
    this.repo.setActivePage(page);
  }
}
