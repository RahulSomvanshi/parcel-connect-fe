import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  await authService.bootstrap();

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
    router.navigateByUrl(authService.getDashboardRoute(), { replaceUrl: true });
    return false;
  }

  return true;
};
