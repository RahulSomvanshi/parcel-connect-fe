import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Protects dashboard routes.
 * - Not logged in → redirect to /login
 * - Logged in but NOT verified → redirect to /otp-verification
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn) {
    router.navigate(['/login']);
    return false;
  }

  if (!authService.isVerified) {
    router.navigate(['/otp-verification'], {
      state: { phone: authService.currentUser?.phone },
    });
    return false;
  }

  return true;
};

/**
 * Prevents authenticated+verified users from accessing login/register pages.
 * Already logged in → redirect to dashboard.
 */
export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn && authService.isVerified) {
    router.navigate([authService.getDashboardRoute()]);
    return false;
  }

  return true;
};

/**
 * Role-based guard for sender-only routes.
 */
export const senderGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.userRole === 'traveller') {
    router.navigate(['/dashboard/traveller']);
    return false;
  }

  return true;
};

/**
 * Role-based guard for traveller-only routes.
 */
export const travellerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.userRole === 'sender') {
    router.navigate(['/dashboard/sender']);
    return false;
  }

  return true;
};
