import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TeamMember } from '../team-members/team-members';

@Component({
  selector: 'app-member-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatAutocompleteModule,
  ],
  templateUrl: './member-modal.html',
  styleUrls: ['./member-modal.css'],
})
export class MemberModal {
  @Input() show: boolean = false;
  @Input() availableMembers: { id: string; name: string }[] = [];
  @Output() save = new EventEmitter<TeamMember>();
  @Output() close = new EventEmitter<void>();

  name: string = '';
  filteredNames: { id: string; name: string }[] = [];

  ngOnInit() {
    this.filterNames();
  }

  ngOnChanges() {
    this.filterNames();
  }

  filterNames() {
    const search = this.name.toLowerCase();
    this.filteredNames = this.availableMembers.filter((m) =>
      m.name.toLowerCase().includes(search)
    );
  }

  onSave() {
    const selected = this.availableMembers.find((m) => m.name === this.name);
    if (selected) {
      this.save.emit({
        id: selected.id,
        name: selected.name,
        role: 'TeamMember',
      });
    }
  }

  onClose() {
    this.close.emit();
  }
}
