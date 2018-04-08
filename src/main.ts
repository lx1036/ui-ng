import { enableProdMode } from '@angular/core';
import {platformBrowser} from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/examples/app.component';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

// platformBrowser().bootstrapModule(AppModule).then().catch();
