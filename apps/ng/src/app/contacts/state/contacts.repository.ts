import { Injectable } from '@angular/core';
import {
  addEntities,
  createState,
  selectRequestStatus,
  Store,
  withEntities,
  withRequestsStatus,
} from '@ngneat/elf';
import {
  PaginationResponse,
  selectActivePage,
  selectActivePageEntities,
  setActivePage,
  setPage,
  setPagination,
  withPagination,
} from '../../../../../../libs/store/src/lib/pagination/pagination';

interface Contact {
  id: number;
  email: string;
  name: string;
  address: string;
}

const { state, config } = createState(
  withPagination(),
  withEntities<Contact>(),
  withRequestsStatus()
);

const store = new Store({ state, config, name: 'contacts' });

@Injectable({ providedIn: 'root' })
export class ContactsRepository {
  activePage$ = store.pipe(selectActivePage());
  activePageContacts$ = store.pipe(selectActivePageEntities());
  status$ = store.pipe(selectRequestStatus('contacts'));

  setActivePage(id: Contact['id']) {
    store.reduce(setActivePage(id));
  }

  addContacts(page: number, contacts: PaginationResponse<Contact>) {
    const { data, ...pagination } = contacts;

    store.reduce(
      addEntities(data),
      setPagination(pagination),
      setPage(
        page,
        data.map((c) => c.id)
      )
    );
  }

  get store() {
    return store;
  }
}
