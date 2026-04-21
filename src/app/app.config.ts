import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
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

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideStore(reducers),
    provideEffects([ParcelEffects, TravellerEffects, AdminEffects]),
    provideRouter(routes, withHashLocation()),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideStoreDevtools({ maxAge: 25, logOnly: false }),
  ],
};
