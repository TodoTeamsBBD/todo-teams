import { Component, inject} from '@angular/core';
import { Router } from '@angular/router';
import { PinInput } from '../../components/pin-input/pin-input';
import { AuthService, Verify2FARequest, UserState } from '../../services/authservice';

@Component({
  selector: 'app-two-factor-auth-page',
  imports: [PinInput],
  templateUrl: './two-factor-verify.html',
  styleUrl: './two-factor-verify.css'
})
export class TwoFactorVerify{
  private router = inject(Router);
  private authService = inject(AuthService);

  qrCodeUrl: string = '';
  verificationError: boolean = false;
  isVerifying: boolean = false;
  isLoadingQR: boolean = false;
  qrError: boolean = false;
  userData: any = null;

  verifyPin(pin: string): void {
    this.isVerifying = true;
    this.verificationError = false;

    const request: Verify2FARequest = { code2FA: pin };

    this.authService.verify2FA(request).subscribe({
      next: () => {
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
