import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QrCodeDisplay } from '../../components/qr-code-display/qr-code-display';
import { PinInput } from '../../components/pin-input/pin-input';
import { AuthService, Enable2FARequest } from '../../services/authservice';

@Component({
  selector: 'app-two-factor-auth-page',
  imports: [QrCodeDisplay, PinInput],
  templateUrl: './two-factor-auth-page.html',
  styleUrl: './two-factor-auth-page.css'
})
export class TwoFactorAuthPage implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);

  currentStep: number = 1;
  qrCodeUrl: string = '';
  verificationError: boolean = false;
  isVerifying: boolean = false;
  isLoadingQR: boolean = false;
  qrError: boolean = false;
  userData: any = null;

  ngOnInit() {
    this.fetchQRCode();
  }

  fetchQRCode(): void {
    this.isLoadingQR = true;
    this.qrError = false;

    this.authService.fetchSignupQRCode().subscribe({
      next: (response) => {
        this.qrCodeUrl = response.qrCodeUrl;
        this.isLoadingQR = false;
      },
      error: (error) => {
        console.error('QR Code fetch error:', error);
        this.isLoadingQR = false;
        this.qrError = true;

        if (error.status === 401) {
          console.error('Authentication token missing or invalid');
          this.router.navigate(['/signup']);
        } else if (error.status === 403) {
          console.error('Two factor authentication already enabled');
          this.router.navigate(['/dashboard']);
        } else if (error.status === 404) {
          console.error('User not found');
          this.router.navigate(['/signup']);
        }
      }
    });
  }


  verifyPin(pin: string): void {
    this.isVerifying = true;
    this.verificationError = false;

    const request: Enable2FARequest = { code2FA: pin };

    this.authService.enable2FA(request).subscribe({
      next: () => {
        this.isVerifying = false;
        this.currentStep = 2;

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
