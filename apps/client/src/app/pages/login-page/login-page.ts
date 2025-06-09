import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserAuthForm, FormField } from '../../components/user-auth-form/user-auth-form';
import { AuthService, LoginRequest } from '../../services/authservice';

@Component({
  selector: 'app-login-page',
  imports: [UserAuthForm],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPage {
  private http = inject(HttpClient);
  loginFields: FormField[] = [
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter your email',
      required: true
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Enter your password',
      required: true
    }
  ];

  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin(formData: any) {
    this.isLoading = true;
    this.errorMessage = '';

    const loginRequest: LoginRequest = {
      email: formData.email,
      password: formData.password
    };

    this.authService.login(loginRequest).subscribe({
      next: (response) => {
        console.log('Login successful:', response);

        // After successful login, check the user's current state
        this.checkUserStateAndNavigate();
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.errorMessage = error;
        this.isLoading = false;
      }
    });
  }

  private checkUserStateAndNavigate() {
    this.http.get('http://localhost:3000/auth/me', {
      withCredentials: true
    }).subscribe({
      next: (response: any) => {
        console.log('User state after login:', response);

        const isAuthenticated = response.userId !== undefined;
        const is2FAVerified = response.verified2FA === true;
        const is2FAVerifiedSession = response.verified2FAsession === true;

        if (isAuthenticated && is2FAVerified && is2FAVerifiedSession) {
          // Fully authenticated - go to dashboard
          this.router.navigate(['/dashboard']);
        } else if (isAuthenticated && is2FAVerified && !is2FAVerifiedSession) {
          // 2FA enabled but not verified in this session
          this.router.navigate(['/verify-2fa']);
        } else if (isAuthenticated && !is2FAVerified) {
          // User exists but 2FA not set up
          this.router.navigate(['/signup-2fa']);
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to check user state:', error);
        this.errorMessage = 'Failed to verify authentication state';
        this.isLoading = false;
      }
    });
  }
}
