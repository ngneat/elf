import {Component, OnInit} from '@angular/core';
import {ContactsService} from './state/contacts.service';
import {generatePages} from './contacts-data';
import {ContactsRepository} from './state/contacts.repository';
import {switchMap, tap} from 'rxjs/operators';
import {asap} from "@ngneat/elf";


@Component({
  selector: 'elf-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css'],
})
export class ContactsComponent implements OnInit {
  indicators: number[] = [];
  contacts$ = this.repo.activePageContacts$;
  status$ = this.repo.status$.pipe(tap(console.log))

  constructor(
    private service: ContactsService,
    private repo: ContactsRepository
  ) {
  }

  ngOnInit() {
    this.repo.activePage$
      .pipe(
        asap(),
        switchMap((page) => {
          return this.service.getContacts(page).pipe(
            tap((c) => {
              this.indicators = generatePages(c.total, c.perPage);
            })
          );
        })
      )
      .subscribe();
  }

  updateActivePage(page: number) {
    this.repo.setActivePage(page);
  }
}
