import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config';

export interface Team {
  id: number;
  name: string;
  created_at: string;
}

export interface Role {
  id: number;
  name: string;
}

export interface UserTeam {
  id: number;
  user_id: string;
  team_id: number;
  role_id: number;
  teams: Team;
  roles: Role;
}

export interface CreateTeamRequest {
  teamName: string;
}

export interface CreateTeamResponse {
  message: string;
  team: Team;
  userRole: any;
}

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private apiUrl: string; // Update with your API URL

  constructor(
      private http: HttpClient,
      private configService: ConfigService
    ) {
      this.apiUrl = this.configService.apiUrl;
    }

  getUserTeams(): Observable<UserTeam[]> {
    return this.http.get<UserTeam[]>(`${this.apiUrl}/api/teams/user`, {
      withCredentials: true
    });
  }

  createTeam(request: CreateTeamRequest): Observable<CreateTeamResponse> {
    return this.http.post<CreateTeamResponse>(`${this.apiUrl}/api/teams`, request, {
      withCredentials: true
    });
  }
}
