import { enableProdMode, ViewEncapsulation } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { createEntitiesStore, createTodo } from '../../../libs/store/src/lib/mocks/stores.mock';
import { persistState } from '@eleanor/store/presist-state';
import { useLocalStorage } from '@eleanor/store/presist-state/storage';
import { map } from 'rxjs/operators';
import { addEntities } from '@eleanor/store/entities';
import { devTools } from '@eleanor/store/devtools';

devTools();
const store = createEntitiesStore();

persistState(store, {
  storage: useLocalStorage,
  source: store => store.pipe(map(state => {
    return {
      $ids: state.$ids
    };
  }))
});

// store.reduce(addEntities(createTodo(1)));

if(environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule, {
    defaultEncapsulation: ViewEncapsulation.Emulated
  })
  .catch((err) => console.error(err));
