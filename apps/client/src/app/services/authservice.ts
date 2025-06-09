import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
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

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth'; // Update with your API URL

  constructor(private http: HttpClient) { }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials, {
      withCredentials: true // Important for cookies
    }).pipe(
      catchError(this.handleError)
    );
  }

  verify2FA(request: Verify2FARequest): Observable<Verify2FAResponse> {
    return this.http.post<Verify2FAResponse>(`${this.apiUrl}/login2FA`, request, {
      withCredentials: true // Important for cookies
    }).pipe(
      catchError(this.handleError)
    );
  }

  logout(): Observable<string> {
    return this.http.post(`${this.apiUrl}/logout`, {}, {
      withCredentials: true,
      responseType: 'text'
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error || error.message;
    }

    return throwError(() => errorMessage);
  }
}
