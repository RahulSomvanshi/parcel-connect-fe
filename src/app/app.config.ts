import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { authInitializer } from './core/auth/auth.initializer';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { reducers } from './store/app.state';
import { ParcelEffects } from './store/parcel/parcel.effects';
import { TravellerEffects } from './store/traveller/traveller.effects';
import { AdminEffects } from './store/admin/admin.effects';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { AuthService } from './core/services/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: authInitializer,
      deps: [AuthService],
      multi: true,
    },
    provideBrowserGlobalErrorListeners(),
    provideStore(reducers),
    provideEffects([ParcelEffects, TravellerEffects, AdminEffects]),
    provideRouter(routes, withHashLocation()),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideStoreDevtools({ maxAge: 25, logOnly: false }),
  ],
};
