import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { QrCodeDisplay } from '../../components/qr-code-display/qr-code-display';
import { PinInput } from '../../components/pin-input/pin-input';

@Component({
  selector: 'app-two-factor-auth-page',
  imports: [QrCodeDisplay, PinInput],
  templateUrl: './two-factor-auth-page.html',
  styleUrl: './two-factor-auth-page.css'
})
export class TwoFactorAuthPage implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);

  currentStep: number = 1;
  qrCodeUrl: string = '';
  backupCode: string = '';
  verificationError: boolean = false;
  isVerifying: boolean = false;
  userData: any = null;

  ngOnInit() {
    // Get the data from router state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.userData = navigation.extras.state;
      this.qrCodeUrl = this.userData['qrCodeUrl'];
      console.log('QR Code URL:', this.qrCodeUrl);
    } else {
      // Fallback: check if there's state in history
      const state = history.state;
      if (state && state.qrCodeUrl) {
        this.userData = state;
        this.qrCodeUrl = state.qrCodeUrl;
      } else {
        // No QR code data available, redirect back to signup
        console.error('No QR code data found');
        this.router.navigate(['/signup']);
        return;
      }
    }
  }

  verifyPin(pin: string): void {
    this.isVerifying = true;
    this.verificationError = false;

    const verificationData = {
      code2FA: pin
    };

    this.http.post('http://localhost:3000/auth/signup/2fa', verificationData, {
      withCredentials: true
    }).subscribe({
      next: (response: any) => {
        console.log('2FA verification successful:', response);
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
