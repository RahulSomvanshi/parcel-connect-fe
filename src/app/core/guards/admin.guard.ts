import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Protects admin-only routes.
 * - Not logged in → redirect to /login
 * - Not verified → redirect to /otp-verification
 * - Not admin role → redirect to /dashboard/sender
 */
export const adminGuard: CanActivateFn = (route, state) => {
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

  if (authService.userRole !== 'admin') {
    router.navigate(['/dashboard/sender']);
    return false;
  }

  return true;
};
