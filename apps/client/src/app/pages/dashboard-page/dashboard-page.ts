import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import {MatDividerModule} from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateTeamForm } from '../../components/create-team-form/create-team-form';
import { ParticipantSearchBar } from '../../components/participant-search-bar/participant-search-bar';
@Component({
  selector: 'app-dashboard-page',
  imports: [MatListModule, MatDividerModule, CommonModule, MatIconModule, MatDialogModule],
  standalone: true,
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css'
})
export class DashboardPage {
  constructor(private dialog: MatDialog) {}

  items = [
    { id: 1, name: 'Team Alpha', description: 'Frontend development team', role: 'owner' },
    { id: 2, name: 'Team Beta', description: 'Backend development team', role: 'participant' },
    { id: 3, name: 'Team Gamma', description: 'DevOps team', role: 'participant' },
    { id: 4, name: 'Team Gamma', description: 'DevOps team', role: 'participant' },
    { id: 5, name: 'Team Gamma', description: 'DevOps team', role: 'participant' },
    { id: 6, name: 'Team Gamma', description: 'DevOps team', role: 'participant' },
    { id: 7, name: 'Team Gamma', description: 'DevOps team', role: 'participant' },
    { id: 8, name: 'Team Gamma', description: 'DevOps team', role: 'owner' },
    { id: 9, name: 'Team Gamma', description: 'DevOps team', role: 'participant' },
    { id: 10, name: 'Team Gamma', description: 'DevOps team', role: 'participant' },
    { id: 11, name: 'Team Gamma', description: 'DevOps team', role: 'participant' },
    { id: 12, name: 'Team Gamma', description: 'DevOps team', role: 'participant' },
    { id: 13, name: 'Team Gamma', description: 'DevOps team', role: 'participant' },
    { id: 14, name: 'Team Gamma', description: 'DevOps team', role: 'participant' },
    { id: 15, name: 'Team Gamma', description: 'DevOps team', role: 'participant' },
    { id: 16, name: 'Team Gamma', description: 'DevOps team', role: 'participant' },
    { id: 17, name: 'Team Gamma', description: 'DevOps team', role: 'participant' },
    { id: 18, name: 'Team Gamma', description: 'DevOps team', role: 'participant' }
  ];

  onItemClick(item: any) {
    console.log('Selected team:', item);
  }

  addTeam() {
    this.dialog.open(CreateTeamForm, {
      maxWidth: '90vw',
      // disableClose: true,
      autoFocus: true
    });
  }

}
