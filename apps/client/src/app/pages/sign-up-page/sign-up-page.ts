import { Component } from '@angular/core';
import { FormField, UserAuthForm } from '../../components/user-auth-form/user-auth-form';

@Component({
  selector: 'app-sign-up-page',
  imports: [UserAuthForm],
  templateUrl: './sign-up-page.html',
  styleUrl: './sign-up-page.css'
})
export class SignUpPage {
  loginFields: FormField[] = [
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

    onLogin(formData: any) {
      console.log('Login data:', formData);
      // Handle your login logic here
      // Example: call your authentication service
      // this.authService.login(formData.email, formData.password);
    }
}
