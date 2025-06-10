import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfigService } from './config';
import { MatSnackBar } from '@angular/material/snack-bar';


export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  userId: string;
  name: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  message: string;
  userId: string;
  name: string;
}

export interface Verify2FARequest {
  code2FA: string;
}

export interface Verify2FAResponse {
  message: string;
  userId: string;
  name: string;
}

export interface Enable2FARequest {
  code2FA: string;
}

export interface Enable2FAResponse {
  message: string;
  userId: string;
  name: string;
}

export interface UserState {
  userId?: string;
  verified2FA?: boolean;
  verified2FAsession?: boolean;
  isAccessAdmin?: boolean;
}

export interface NavigationResult {
  path: string;
  userState: UserState;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private snackBar: MatSnackBar
  ) {
    this.apiUrl = this.configService.apiUrl;
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.post<LoginResponse>('auth/login', credentials);
  }

  signup(credentials: SignupRequest): Observable<SignupResponse> {
    return this.post<SignupResponse>('auth/signup', credentials);
  }

  verify2FA(request: Verify2FARequest): Observable<Verify2FAResponse> {
    return this.post<Verify2FAResponse>('auth/login/2fa', request);
  }

  enable2FA(request: Enable2FARequest): Observable<Enable2FAResponse> {
    return this.post<Enable2FAResponse>('auth/signup/2fa', request);
  }

  logout(): Observable<string> {
    return this.postText('auth/logout', {});
  }

  private post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, body, {
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  private postText(endpoint: string, body: any): Observable<string> {
    return this.http.post(`${this.apiUrl}/${endpoint}`, body, {
      withCredentials: true,
      responseType: 'text'
    }).pipe(
      catchError(this.handleError)
    );
  }

  getCurrentUserState(): Observable<UserState> {
    return this.http.get<UserState>(`${this.apiUrl}/auth/me`, {
      withCredentials: true
    });
  }

  fetchSignupQRCode(): Observable<{ qrCodeUrl: string }> {
  return this.http.get<{ qrCodeUrl: string }>(`${this.apiUrl}/auth/signup/qr`, {
    withCredentials: true
  }).pipe(
    catchError(this.handleError)
  );
  }

  private handleError = (error: HttpErrorResponse) => {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = typeof error.error === 'string' ? error.error : error.error.message;
    }

    this.snackBar.open(errorMessage, 'Close', {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });

    return throwError(() => errorMessage);
  }
}
