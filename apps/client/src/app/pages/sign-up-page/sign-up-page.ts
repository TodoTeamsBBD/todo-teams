import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormField, UserAuthForm } from '../../components/user-auth-form/user-auth-form';
import { AuthService } from '../../services/authservice';

@Component({
  selector: 'app-sign-up-page',
  imports: [UserAuthForm],
  templateUrl: './sign-up-page.html',
  styleUrl: './sign-up-page.css'
})
export class SignUpPage {
  private authService = inject(AuthService);
  private router = inject(Router);

  signupFields: FormField[] = [
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'Enter your email',
        required: true
      },
      {
        name: 'fullname',
        label: 'Full Name',
        type: 'name',
        placeholder: 'Enter your full name',
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

  onSignup(formData: any) {
    this.isLoading = true;
    this.errorMessage = '';

    const signupData = {
      name: formData.fullname,
      email: formData.email,
      password: formData.password
    };

    this.authService.signup(signupData).subscribe({
      next: (response) => {
        console.log('Signup successful:', response);
        this.router.navigate(['/signup-2fa']);
      },
      error: (errorMessage: string) => {
        console.error('Signup error:', errorMessage);
        this.isLoading = false;

        // Handle specific error messages or provide a default
        if (errorMessage.includes('email already exists') || errorMessage.includes('409')) {
          this.errorMessage = 'Email already exists. Please use a different email.';
        } else if (errorMessage.includes('required fields') || errorMessage.includes('400')) {
          this.errorMessage = 'Please fill in all required fields.';
        } else {
          this.errorMessage = errorMessage || 'An error occurred during signup. Please try again.';
        }
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
