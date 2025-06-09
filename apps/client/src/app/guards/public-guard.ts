import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';

export const publicGuard: CanActivateFn = (route, state) => {
  const http = inject(HttpClient);
  const router = inject(Router);

  return http.get('http://localhost:3000/auth/me', {
    withCredentials: true
  }).pipe(
    map((response: any) => {
      console.log('Public guard - User details:', response);

      const isAuthenticated = response.userId !== undefined;
      const is2FAVerified = response.verified2FA === true;
      const is2FAVerifiedSession = response.verified2FAsession === true;

      // If fully authenticated, redirect to dashboard
      if (isAuthenticated && is2FAVerified && is2FAVerifiedSession) {
        router.navigate(['/dashboard']);
        return false;
      }

      // If user exists but 2FA not set up, redirect to 2FA setup
      if (isAuthenticated && !is2FAVerified) {
        router.navigate(['/signup-2fa']);
        return false;
      }

      // Allow access to public routes (login/signup)
      return true;
    }),
    catchError((error) => {
      console.log('Public guard - Auth check failed:', error);
      // If error, user is not authenticated, allow access to public routes
      return of(true);
    })
  );
};
