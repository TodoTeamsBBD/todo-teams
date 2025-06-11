import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './config';

import {
  TeamMember,
  MemberRole,
} from '../components/team-members/team-members';

export interface TeamMembersResponse {
  teamId: number;
  members: TeamMember[];
}

@Injectable({
  providedIn: 'root',
})
export class UserRoleService {
  private baseUrl: string;

  constructor(
      private http: HttpClient,
      private configService: ConfigService,
    ) {
      this.baseUrl = this.configService.apiUrl;
    }

  assignUserRole(userId: string, roleId: number, teamId: number) {
    return this.http.post(
      `${this.baseUrl}/api/user-roles`,
      { userId, roleId, teamId },
      { withCredentials: true }
    );
  }

  getUsersByTeam(teamId: number): Observable<TeamMembersResponse> {
    return this.http.get<TeamMembersResponse>(
      `${this.baseUrl}/api/user-roles/team/${teamId}/users`,
      {
        withCredentials: true,
      }
    );
  }

  removeTeamMember(userRoleId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/api/user-roles/${userRoleId}`,
      { withCredentials: true }
    );
  }
}
