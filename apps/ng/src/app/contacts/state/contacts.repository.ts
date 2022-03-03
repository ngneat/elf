import { Injectable } from '@angular/core';
import { createStore } from '@ngneat/elf';
import { addEntities, withEntities } from '@ngneat/elf-entities';
import {
  PaginationData,
  selectCurrentPage,
  selectCurrentPageEntities,
  selectPaginationData,
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

const store = createStore(
  { name: 'contacts' },
  withPagination(),
  withEntities<Contact>()
);

@Injectable({ providedIn: 'root' })
export class ContactsRepository {
  activePage$ = store.pipe(selectCurrentPage());
  paginationData$ = store.pipe(selectPaginationData());
  activePageContacts$ = store.pipe(selectCurrentPageEntities());

  setActivePage(id: Contact['id']) {
    store.update(setCurrentPage(id));
  }

  addContacts(page: number, contacts: PaginationData & { data: Contact[] }) {
    const { data, ...pagination } = contacts;

    store.update(
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
