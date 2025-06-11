import { Component, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateTeamForm } from '../../components/create-team-form/create-team-form';
import { ParticipantSearchBar } from '../../components/participant-search-bar/participant-search-bar';
import { TeamService, UserTeam } from '../../services/teamservice'; // Adjust path as needed
import { Router } from '@angular/router';

interface TeamItem {
  id: number;
  name: string;
  description: string;
  role: string;
  created_at: string;
}

@Component({
  selector: 'app-dashboard-page',
  imports: [MatListModule, MatDividerModule, CommonModule, MatIconModule, MatDialogModule],
  standalone: true,
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css'
})
export class DashboardPage implements OnInit {
  items: TeamItem[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private dialog: MatDialog,
    private teamService: TeamService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadUserTeams();
  }

  loadUserTeams() {
    this.isLoading = true;
    this.errorMessage = '';

    this.teamService.getUserTeams().subscribe({
      next: (userTeams: UserTeam[]) => {
        // Transform the API response to match your component's expected format
        this.items = userTeams.map(userTeam => ({
          id: userTeam.teams.id,
          name: userTeam.teams.name,
          description: `Team created on ${new Date(userTeam.teams.created_at).toLocaleDateString()}`,
          role: userTeam.roles.name.toLowerCase(), // Assuming role names like 'TeamLead', 'Member', etc.
          created_at: userTeam.teams.created_at
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading user teams:', error);
        this.errorMessage = 'Failed to load teams. Please try again.';
        this.isLoading = false;
      }
    });
  }

  onItemClick(item: TeamItem) {
    console.log('Selected team:', item);
    // Add navigation logic here if needed
    // this.router.navigate(['/team', item.id]);
    this.router.navigate(['/to-do-list'], {
      queryParams: {
        teamId: item.id,
      },
    });
  }

  addTeam() {
    const dialogRef = this.dialog.open(CreateTeamForm, {
      maxWidth: '90vw',
      autoFocus: true
    });

    // Refresh the teams list when a new team is created
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('New team created:', result);
        // Reload the teams list to include the new team
        this.loadUserTeams();
      }
    });
  }
}
