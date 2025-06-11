import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Team, TeamMember, TeamService, UserTeam } from '../../services/teamservice';
import { FormsModule } from '@angular/forms';
export interface DataItem {
  id: number;
  name: string;
  email: string;
  role: string;
  role_id: number;
}

@Component({
  selector: 'app-participant-search-bar',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule,],
  templateUrl: './participant-search-bar.html',
  styleUrl: './participant-search-bar.css'
})
export class ParticipantSearchBar {
  data: DataItem[] = [];
  loading = false;

  constructor(
    private teamService: TeamService,
    @Inject(MAT_DIALOG_DATA) public teamData: Team
  ) {}

  ngOnInit() {
    this.loadTeamMembers(this.teamData.id);
  }

  loadTeamMembers(teamId: number) {
    this.loading = true;
    this.teamService.getTeamMembers(teamId).subscribe({
      next: (members: TeamMember[]) => {
        this.data = members.map((member): DataItem => ({
          id: member.id,
          name: member.users.username,
          email: member.users.email,
          role: member.roles.name,
          role_id: member.role_id
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load team members', err);
        this.loading = false;
      }
    });
  }

  changeRole(item: DataItem, event: Event) {
      const selectElement = event.target as HTMLSelectElement;
      const newRoleId = Number(selectElement.value);

      if (newRoleId !== item.role_id) {
        this.teamService.updateUserRole(item.id, newRoleId).subscribe({
          next: () => {
            item.role_id = newRoleId;
            item.role = newRoleId === 2 ? 'TeamLead' : 'TeamMember';
          },
          error: (err) => {
            console.error('Failed to update role', err);
            alert('Failed to update role');
          }
        });
      }
    }


  onAdd() {
    // Your add logic here
  }
}

