import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { AuthService } from '../services/authservice';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getCurrentUserState().pipe(
    map((response: any) => {

      const isAuthenticated = response.userId !== undefined;
      const is2FAVerified = response.verified2FA === true;
      const is2FAVerifiedSession = response.verified2FAsession === true;
      const isAccessAdmin = response.isAccessAdmin === true;

      if (isAuthenticated && is2FAVerified && is2FAVerifiedSession) {

        if (isAccessAdmin && state.url.startsWith('/dashboard')) {
          router.navigate(['/access-admin']);
          return false;
        }

        if (!isAccessAdmin && state.url.startsWith('/admin')) {
          router.navigate(['/dashboard']);
          return false;
        }

        if (
          state.url === '/login' ||
          state.url === '/signup' ||
          state.url === '/signup-2fa' ||
          state.url === '/verify-2fa'
        ) {
          router.navigate([isAccessAdmin ? '/access-admin' : '/dashboard']);
          return false;
        }

        return true;
      }

      // If user exists but 2FA not completed, handle 2FA flow
      if (isAuthenticated && is2FAVerified && !is2FAVerifiedSession) {
        // User has 2FA enabled but not verified in this session - send to login
        if (state.url !== '/verify-2fa') {
          router.navigate(['/verify-2fa']);
          return false;
        }
        return true;
      }

      // If user exists but no 2FA setup, send to 2FA setup
      if (isAuthenticated && !is2FAVerified) {
        if (state.url !== '/signup-2fa') {
          router.navigate(['/signup-2fa']);
          return false;
        }
        return true;
      }

      // No authentication - send to login for protected routes
      if (state.url !== '/login' && state.url !== '/signup') {
        router.navigate(['/login']);
        return false;
      }

      return true;
    }),
    catchError((error) => {

      if (state.url !== '/login' && state.url !== '/signup') {
        router.navigate(['/login']);
        return of(false);
      }

      return of(true);
    })
  );
};
