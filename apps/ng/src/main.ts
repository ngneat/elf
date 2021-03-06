import {
  ApplicationRef,
  enableProdMode,
  ViewEncapsulation,
} from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { devTools } from '@ngneat/elf-devtools';
import { enableElfProdMode } from '@ngneat/elf';

if (environment.production) {
  enableProdMode();
  enableElfProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule, {
    defaultEncapsulation: ViewEncapsulation.Emulated,
  })
  .then((moduleRef) => {
    devTools({
      postTimelineUpdate: () => moduleRef.injector.get(ApplicationRef).tick(),
    });
  })
  .catch((err) => console.error(err));
