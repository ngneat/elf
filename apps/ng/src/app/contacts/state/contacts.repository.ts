import { Injectable } from '@angular/core';
import { addEntities, createState, Store, withEntities } from '@ngneat/elf';

import { selectRequestStatus, withRequestsStatus } from '@ngneat/elf-requests';
import {
  PaginationData,
  selectCurrentPage,
  selectCurrentPageEntities,
  setCurrentPage,
  setPage,
  updatePaginationData,
  withPagination,
} from '@ngneat/elf-pagination';

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
  activePage$ = store.pipe(selectCurrentPage());
  activePageContacts$ = store.pipe(selectCurrentPageEntities());
  status$ = store.pipe(selectRequestStatus('contacts'));

  setActivePage(id: Contact['id']) {
    store.reduce(setCurrentPage(id));
  }

  addContacts(page: number, contacts: PaginationData & { data: Contact[] }) {
    const { data, ...pagination } = contacts;

    store.reduce(
      addEntities(data),
      updatePaginationData(pagination),
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
