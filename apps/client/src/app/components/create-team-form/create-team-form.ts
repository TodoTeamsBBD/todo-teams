import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TeamService, CreateTeamRequest } from '../../services/teamservice';// Adjust path as needed

@Component({
  standalone: true,
  selector: 'app-create-team-form',
  imports: [CommonModule, MatDialogModule, FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './create-team-form.html',
  styleUrl: './create-team-form.css'
})
export class CreateTeamForm {
  teamName: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    public dialogRef: MatDialogRef<CreateTeamForm>,
    private teamService: TeamService
  ) {}

  close() {
    this.dialogRef.close();
  }

  createTeam() {
    if (!this.teamName.trim()) {
      this.errorMessage = 'Team name is required';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const request: CreateTeamRequest = {
      teamName: this.teamName.trim()
    };

    this.teamService.createTeam(request).subscribe({
      next: (response) => {
        console.log('Team created successfully:', response);
        // Close dialog and return the created team
        this.dialogRef.close(response.team);
      },
      error: (error) => {
        console.error('Error creating team:', error);
        this.errorMessage = error.error?.message || 'Failed to create team. Please try again.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
