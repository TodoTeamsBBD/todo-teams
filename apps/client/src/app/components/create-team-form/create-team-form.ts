import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@Component({
  standalone: true,
  selector: 'app-create-team-form',
  imports: [CommonModule, MatDialogModule, FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './create-team-form.html',
  styleUrl: './create-team-form.css'
})
export class CreateTeamForm {
  constructor(public dialogRef: MatDialogRef<CreateTeamForm>) {}

  close() {
    this.dialogRef.close();
  }

  createTeam() {
    // logic to create a team
    this.dialogRef.close();
  }
}
