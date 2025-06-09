import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const http = inject(HttpClient);
  const router = inject(Router);

  return http.get('http://localhost:3000/auth/me', {
    withCredentials: true
  }).pipe(
    map((response: any) => {
      console.log('User details response:', response);

      // Check authentication status
      const isAuthenticated = response.userId !== undefined;
      const is2FAVerified = response.verified2FA === true;
      const is2FAVerifiedSession = response.verified2FAsession === true;

      // If both 2FA flags are true, user is fully authenticated
      if (isAuthenticated && is2FAVerified && is2FAVerifiedSession) {
        // Allow access to protected routes, redirect to dashboard if trying to access auth pages
        if (state.url === '/login' || state.url === '/signup' || state.url === '/signup-2fa') {
          router.navigate(['/dashboard']);
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
      console.log('Auth check failed:', error);

      // If error (like 401/403), user is not authenticated
      if (state.url !== '/login' && state.url !== '/signup') {
        router.navigate(['/login']);
        return of(false);
      }

      return of(true);
    })
  );
};
