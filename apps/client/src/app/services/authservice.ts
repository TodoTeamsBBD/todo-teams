import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

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

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  userId: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class Authservice {


  constructor(private http: HttpClient) {}

  signup(signupData: SignupRequest): Observable<SignupResponse> {
    return this.http.post<SignupResponse>(`/signup`, signupData, {
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  login(loginData: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`/login`, loginData, {
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  logout(): Observable<string> {
    return this.http.post<string>(`/logout`, {}, {
      withCredentials: true,
      responseType: 'text' as 'json'
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
