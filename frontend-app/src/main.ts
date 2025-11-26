import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

// Register French locale data so DatePipe and other i18n pipes can format 'fr' correctly.
registerLocaleData(localeFr, 'fr');

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
