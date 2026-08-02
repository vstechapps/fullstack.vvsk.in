import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export function initializeApp() {
  return async () => {
    if (typeof Firebase !== 'undefined' && typeof Firebase.init === 'function') {
      await Firebase.init();
    }

    if (typeof Loader !== 'undefined' && typeof Loader.init === 'function') {
      Loader.init();
    }
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      multi: true
    }
  ]
};
