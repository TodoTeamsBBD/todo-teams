import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuthForm, FormField } from '../../components/user-auth-form/user-auth-form';
import { AuthService, LoginRequest } from '../../services/authservice';

@Component({
  selector: 'app-login-page',
  imports: [UserAuthForm],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPage {
  private authService = inject(AuthService);
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
      this.authService.getCurrentUserState().subscribe({
      next: (userState) => {
        const { userId, verified2FA, verified2FAsession } = userState;

        if (userId && verified2FA && verified2FAsession) {
          this.router.navigate(['/dashboard']);
        } else if (userId && verified2FA && !verified2FAsession) {
          this.router.navigate(['/verify-2fa']);
        } else if (userId && !verified2FA) {
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
