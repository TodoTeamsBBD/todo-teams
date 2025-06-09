import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-qr-code-display',
  imports: [CommonModule],
  templateUrl: './qr-code-display.html',
  styleUrl: './qr-code-display.css'
})
export class QrCodeDisplay {
  @Input() qrCodeUrl: string = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/YourApp:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=YourApp';
  @Input() title: string = 'Scan QR Code';
  @Input() subtitle: string = 'Open Microsoft Authenticator and scan this code';
  @Input() backupCode: string = 'JBSWY3DPEHPK3PXP';
  @Input() showBackupCode: boolean = true;

  copied: boolean = false;

  copyBackupCode(): void {
    navigator.clipboard.writeText(this.backupCode).then(() => {
      this.copied = true;
      setTimeout(() => this.copied = false, 2000);
    });
  }

  onImageError(): void {
    console.error('Failed to load QR code image');
  }
}
