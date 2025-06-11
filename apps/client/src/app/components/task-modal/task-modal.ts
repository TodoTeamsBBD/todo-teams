import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { TeamMember, MemberRole } from '../team-members/team-members';

@Component({
  selector: 'app-task-modal',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './task-modal.html',
  styleUrls: ['./task-modal.css'],
})
export class TaskModal {
  @Input() show = false;
  @Input() isEditMode = false;
  @Input() task = { title: '', description: '', assigned_to: '' };
  @Input() teamMembers: string[] = [];
  @Input() canEditAssignedTo: boolean = true;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  onSave() {
    if (this.task.title && this.task.assigned_to) {
      this.save.emit(this.task);
    }
  }

  onClose() {
    this.close.emit();
  }
}
