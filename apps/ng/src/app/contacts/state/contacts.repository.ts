import { Injectable } from '@angular/core';
import { addEntities, createState, Store, withEntities } from '@ngneat/elf';

import { selectRequestStatus, withRequestsStatus } from '@ngneat/elf-requests';
import {
  PaginationResponse,
  selectCurrentPage,
  selectActivePageEntities,
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
  activePageContacts$ = store.pipe(selectActivePageEntities());
  status$ = store.pipe(selectRequestStatus('contacts'));

  setActivePage(id: Contact['id']) {
    store.reduce(setCurrentPage(id));
  }

  addContacts(page: number, contacts: PaginationResponse<Contact>) {
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
