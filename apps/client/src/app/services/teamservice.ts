import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfigService } from './config';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface Team {
  id: number;
  name: string;
  created_at: string;
}

export interface Role {
  id: number;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  status: string;
}

export interface UserTeam {
  id: number;
  user_id: string;
  team_id: number;
  role_id: number;
  teams: Team;
  roles: Role;
  user: User; // 👈 include this
}

export interface TeamMember {
  id: number;
  role_id: number;
  users: {
    username: string;
    email: string;
  };
  teams: {
    name: string;
  };
  roles: {
    name: string;
  };
}

export interface CreateTeamRequest {
  teamName: string;
}

export interface CreateTeamResponse {
  message: string;
  team: Team;
  userRole: any;
}

export interface PaginatedTeams {
  data: Team[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private apiUrl: string; // Update with your API URL

  constructor(
      private http: HttpClient,
      private configService: ConfigService,
      private snackBar: MatSnackBar
    ) {
      this.apiUrl = this.configService.apiUrl;
    }

  getUserTeams(): Observable<UserTeam[]> {
    return this.http.get<UserTeam[]>(`${this.apiUrl}/api/teams/user`, {
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  createTeam(request: CreateTeamRequest): Observable<CreateTeamResponse> {
    return this.http.post<CreateTeamResponse>(`${this.apiUrl}/api/teams`, request, {
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  getTeams(page: number, pageSize: number): Observable<PaginatedTeams> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PaginatedTeams>(`${this.apiUrl}/api/teams`, {
      params,
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

 getTeamMembers(teamId: number): Observable<TeamMember[]> {
    return this.http.get<TeamMember[]>(`${this.apiUrl}/api/user-roles/team/${teamId}`, {
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  updateUserRole(userRoleId: number, newRoleId: number): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/api/user-roles/${userRoleId}`,
      { role: newRoleId },
      { withCredentials: true }
    ).pipe(
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
