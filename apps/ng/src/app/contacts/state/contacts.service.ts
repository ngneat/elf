import {Injectable} from '@angular/core';
import {getData} from '../contacts-data';
import {timer} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {ContactsRepository} from './contacts.repository';
import {skipWhilePageExists} from "../../../../../../libs/store/src/lib/pagination/pagination";
import {setRequestStatus} from "@ngneat/elf";

@Injectable({providedIn: 'root'})
export class ContactsService {
  constructor(private repo: ContactsRepository) {
  }

  getContacts(page: number) {
    return timer(300).pipe(
      map(() => getData({page})),
      tap((res) => {
        this.repo.addContacts(page, res);
      }),
      setRequestStatus(this.repo.store, 'contacts'),
      skipWhilePageExists(this.repo.store, page)
    );
  }
}
