import { Component, OnInit } from '@angular/core';
import { ContactsService } from './state/contacts.service';
import { generatePages } from './contacts-data';
import { ContactsRepository } from './state/contacts.repository';
import { map, startWith, switchMap } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'elf-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent implements OnInit {
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
  sortByControl = new FormControl();
  perPageControl = new FormControl();

  constructor(
    private service: ContactsService,
    private repo: ContactsRepository
  ) {}

  ngOnInit() {
    const sortByInit = 'name';
    const perPageInit = '10';
    this.sortByControl = new FormControl(sortByInit);
    this.perPageControl = new FormControl(perPageInit);
  }

  updateActivePage(page: number) {
    this.repo.setActivePage(page);
  }
}
