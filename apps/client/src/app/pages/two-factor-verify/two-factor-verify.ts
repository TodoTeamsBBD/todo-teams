import { Component, inject} from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { QrCodeDisplay } from '../../components/qr-code-display/qr-code-display';
import { PinInput } from '../../components/pin-input/pin-input';

@Component({
  selector: 'app-two-factor-auth-page',
  imports: [QrCodeDisplay, PinInput],
  templateUrl: './two-factor-verify.html',
  styleUrl: './two-factor-verify.css'
})
export class TwoFactorVerify{
  private router = inject(Router);
  private http = inject(HttpClient);

  qrCodeUrl: string = '';
  verificationError: boolean = false;
  isVerifying: boolean = false;
  isLoadingQR: boolean = false;
  qrError: boolean = false;
  userData: any = null;

  verifyPin(pin: string): void {
    this.isVerifying = true;
    this.verificationError = false;

    const verificationData = {
      code2FA: pin
    };

    this.http.post('http://localhost:3000/auth/login/2fa', verificationData, {
      withCredentials: true
    }).subscribe({
      next: (response: any) => {
        console.log('2FA verification successful:', response);
        this.isVerifying = false;

        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1500);
      },
      error: (error) => {
        console.error('2FA verification error:', error);
        this.isVerifying = false;
        this.verificationError = true;

        if (error.status === 401) {
          console.error('Invalid 2FA code');
        } else if (error.status === 403) {
          console.error('Authentication token issue');
        }
      }
    });
  }
}
