import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HeaderModule } from './app/header/header.module';

import { SearchModule } from './app/search/search.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(SearchModule)
  .catch(err => console.error(err));
platformBrowserDynamic().bootstrapModule(HeaderModule)
  .catch(err => console.error(err));
