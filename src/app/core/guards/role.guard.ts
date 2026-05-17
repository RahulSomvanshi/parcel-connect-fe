import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Redirect bare /dashboard to the correct home for the logged-in role */
export const dashboardEntryGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const url = state.url.split('?')[0].replace(/\/$/, '');

  if (url === '/dashboard') {
    router.navigateByUrl(authService.getDashboardRoute(), { replaceUrl: true });
    return false;
  }

  return true;
};

const denyWrongRole = (authService: AuthService, router: Router): boolean => {
  if (!authService.isLoggedIn) {
    router.navigateByUrl('/login', { replaceUrl: true });
    return false;
  }
  router.navigateByUrl(authService.getDashboardRoute(), { replaceUrl: true });
  return false;
};

export const senderGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  await authService.bootstrap();
  return authService.userRole === 'sender' ? true : denyWrongRole(authService, router);
};

export const travellerGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  await authService.bootstrap();
  return authService.userRole === 'traveller' ? true : denyWrongRole(authService, router);
};
