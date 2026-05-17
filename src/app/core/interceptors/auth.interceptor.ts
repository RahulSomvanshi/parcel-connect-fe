import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/** Attaches JWT; on 401 clears session (no role-based redirects). */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  const isAuthEndpoint =
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/register') ||
    req.url.includes('/auth/verify-otp') ||
    req.url.includes('/auth/resend-otp') ||
    req.url.includes('/auth/refresh-token');

  const authedReq =
    token && !isAuthEndpoint
      ? req.clone({
          setHeaders: { Authorization: `Bearer ${token}` },
        })
      : req;

  return next(authedReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && !isAuthEndpoint) {
        authService.clearSession(false);
      }
      return throwError(() => err);
    })
  );
};
