import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Protects dashboard routes.
 * - Not logged in → redirect to /login
 * - Logged in but NOT verified → redirect to /otp-verification
 */
export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  await authService.bootstrap(true);

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
export const guestGuard: CanActivateFn = async (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const reauth =
    route.queryParamMap.get('reauth') === '1' ||
    route.queryParamMap.get('switch') === '1';

  if (reauth && authService.isLoggedIn) {
    authService.clearSession(true);
    return true;
  }

  await authService.bootstrap();

  if (authService.isLoggedIn && authService.isVerified) {
    router.navigate([authService.getDashboardRoute()], { replaceUrl: true });
    return false;
  }

  return true;
};
