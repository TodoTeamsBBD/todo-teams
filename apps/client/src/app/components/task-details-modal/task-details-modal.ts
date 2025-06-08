import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-details-modal',
  imports: [CommonModule],
  templateUrl: './task-details-modal.html',
  styleUrls: ['./task-details-modal.css']
})
export class TaskDetailsModal {
  @Input() task: any = null;
  @Output() close = new EventEmitter<void>();

}



