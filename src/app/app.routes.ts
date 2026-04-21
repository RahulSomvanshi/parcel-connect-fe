import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

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
  // All routes accessible to any authenticated user (user/admin)
  // Users can switch between Sender and Traveller modes freely
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layouts/dashboard-layout/dashboard-layout').then(
        (m) => m.DashboardLayout
      ),
    children: [
      { path: '', redirectTo: 'sender', pathMatch: 'full' },

      // ── Sender Mode ──
      {
        path: 'sender',
        loadComponent: () =>
          import('./pages/sender-dashboard/sender-dashboard').then(
            (m) => m.SenderDashboard
          ),
      },
      {
        path: 'create-parcel',
        loadComponent: () =>
          import('./pages/create-parcel/create-parcel').then(
            (m) => m.CreateParcel
          ),
      },
      {
        path: 'my-parcels',
        loadComponent: () =>
          import('./pages/my-parcels/my-parcels').then((m) => m.MyParcels),
      },

      // ── Traveller Mode ──
      {
        path: 'traveller',
        loadComponent: () =>
          import('./pages/traveller-dashboard/traveller-dashboard').then(
            (m) => m.TravellerDashboard
          ),
      },
      {
        path: 'matching-parcels',
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
        loadComponent: () =>
          import('./pages/add-travel-plan/add-travel-plan').then(
            (m) => m.AddTravelPlan
          ),
      },

      // ── Admin Mode (admin role only) ──
      {
        path: 'admin',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./pages/admin-dashboard/admin-dashboard').then(
            (m) => m.AdminDashboard
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];
