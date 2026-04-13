import { Routes } from '@angular/router';
import { authGuard, guestGuard, senderGuard, travellerGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // ── Public / Guest Routes ──
  {
    path: 'landing',
    loadComponent: () =>
      import('./pages/landing/landing').then((m) => m.Landing),
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./pages/register/register').then((m) => m.Register),
  },
  {
    path: 'otp-verification',
    loadComponent: () =>
      import('./pages/otp-verification/otp-verification').then(
        (m) => m.OtpVerification
      ),
  },

  // ── Protected Dashboard Routes ──
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layouts/dashboard-layout/dashboard-layout').then(
        (m) => m.DashboardLayout
      ),
    children: [
      { path: '', redirectTo: 'sender', pathMatch: 'full' },

      // Sender routes
      {
        path: 'sender',
        canActivate: [senderGuard],
        loadComponent: () =>
          import('./pages/sender-dashboard/sender-dashboard').then(
            (m) => m.SenderDashboard
          ),
      },
      {
        path: 'create-parcel',
        canActivate: [senderGuard],
        loadComponent: () =>
          import('./pages/create-parcel/create-parcel').then(
            (m) => m.CreateParcel
          ),
      },
      {
        path: 'my-parcels',
        canActivate: [senderGuard],
        loadComponent: () =>
          import('./pages/my-parcels/my-parcels').then((m) => m.MyParcels),
      },

      // Traveller routes
      {
        path: 'traveller',
        canActivate: [travellerGuard],
        loadComponent: () =>
          import('./pages/traveller-dashboard/traveller-dashboard').then(
            (m) => m.TravellerDashboard
          ),
      },
      {
        path: 'matching-parcels',
        canActivate: [travellerGuard],
        loadComponent: () =>
          import('./pages/matching-parcels/matching-parcels').then(
            (m) => m.MatchingParcels
          ),
      },
      {
        path: 'my-deliveries',
        loadComponent: () =>
          import('./pages/my-deliveries/my-deliveries').then(
            (m) => m.MyDeliveries
          ),
      },
      {
        path: 'add-travel-plan',
        canActivate: [travellerGuard],
        loadComponent: () =>
          import('./pages/add-travel-plan/add-travel-plan').then(
            (m) => m.AddTravelPlan
          ),
      },
    ],
  },
  { path: '**', redirectTo: '/login' },
];
