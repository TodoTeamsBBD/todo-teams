import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { TeamMember, MemberRole } from '../team-members/team-members';
import { Task } from '../../pages/to-do-list/to-do-list';

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
  @Input() task: Task = { id: 0, title: '', description: '' };
  // @Input() teamMembers: string[] = [];
  @Input() teamMembers: TeamMember[] = [];
  @Input() canEditAssignedTo: boolean = true;
//   get canEditAssignedTo(): boolean {
//   return !this.isEditMode;
// }


  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  onSave() {
    if (this.task.title && this.task.description && this.task.assigned_to ) {
      this.save.emit(this.task);
    } else {
      alert('Please fill all fields.');
    }
  }

  onClose() {
    this.close.emit();
  }
}
