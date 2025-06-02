import { Component } from '@angular/core';
import { UserAuthForm, FormField } from '../../components/user-auth-form/user-auth-form';

@Component({
  selector: 'app-login-page',
  imports: [UserAuthForm],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPage {
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

  onLogin(formData: any) {
    console.log('Login data:', formData);
    // Handle your login logic here
    // Example: call your authentication service
    // this.authService.login(formData.email, formData.password);
  }
}
