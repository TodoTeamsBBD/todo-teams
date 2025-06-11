import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-modal',
  imports: [CommonModule],
  templateUrl: './delete-modal.html',
  styleUrls: ['./delete-modal.css'],
})
export class DeleteModal {
  @Input() show: boolean = false;
  @Input() title: string = 'Confirm Delete';
  @Input() message: string = 'Are you sure you want to delete this item?';
  @Input() details?: string;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  handleConfirm() {
    this.confirm.emit();
  }

  handleCancel() {
    this.cancel.emit();
  }
}
