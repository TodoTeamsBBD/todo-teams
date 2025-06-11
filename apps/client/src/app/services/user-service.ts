import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from './config';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AvailableMember } from '../components/team-members/team-members';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl: string;
  
    constructor(
        private http: HttpClient,
        private configService: ConfigService,
      ) {
        this.baseUrl = this.configService.apiUrl;
      }

  getAvailableUsers(): Observable<AvailableMember[]> {
    return this.http
      .get<{ id: string; username: string }[]>(
        `${this.baseUrl}/api/users/teams/available-members`,
        {
          withCredentials: true,
        }
      )
      .pipe(
        map((users) =>
          users.map((u) => ({
            id: u.id,
            name: u.username,
          }))
        )
      );
  }
}
