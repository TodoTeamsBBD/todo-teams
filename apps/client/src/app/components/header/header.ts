import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/authservice';// Update path as needed

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  showNavbar = true;
  isLoggingOut = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    // Listen to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const hiddenRoutes = ['/login', '/signup'];
      this.showNavbar = !hiddenRoutes.includes(event.urlAfterRedirects);
    });
  }

  onLogout() {
    this.isLoggingOut = true;

    this.authService.logout().subscribe({
      next: (response) => {
        this.router.navigate(['/login']);
        this.isLoggingOut = false;
      },
      error: (error) => {
        console.error('Logout failed:', error);
        // Even if logout fails, redirect to login for security
        this.router.navigate(['/login']);
        this.isLoggingOut = false;
      }
    });
  }
}
