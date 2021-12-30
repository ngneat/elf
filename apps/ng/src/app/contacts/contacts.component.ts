import { Component, OnInit } from '@angular/core';
import { ContactsService } from './state/contacts.service';
import { ContactsRepository } from './state/contacts.repository';
import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'elf-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent implements OnInit {
  contacts$ = this.repo.activePageContacts$;
  paginationData$ = this.repo.paginationData$;
  sub: Subscription | null = null;

  constructor(
    private service: ContactsService,
    private repo: ContactsRepository
  ) {}

  ngOnInit() {
    this.sub = this.repo.activePage$
      .pipe(switchMap((page) => this.service.getContacts(page)))
      .subscribe();
  }

  updateActivePage(page: number) {
    this.repo.setActivePage(page);
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
