import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MemberModal } from '../member-modal/member-modal';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { DeleteModal } from '../../components/delete-modal/delete-modal';
import { UserRoleService } from '../../services/user-role-service';
import { ROLE_ENUM } from '../../utils';
import { UserService } from '../../services/user-service';

export type MemberRole = 'TeamLead' | 'TeamMember';

export interface TeamMember {
  id: string;
  name: string;
  role: MemberRole;
  userRoleId?: number;
}

export interface AvailableMember {
  id: string;
  name: string;
}

@Component({
  selector: 'app-team-members',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MemberModal,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    DeleteModal,
  ],
  templateUrl: './team-members.html',
  styleUrls: ['./team-members.css'],
})
export class TeamMembers {
  @Input() members: TeamMember[] = [];
  @Input() teamId: number = 0;

  searchText: string = '';
  showDeleteModal = false;
  showMemberModal = false;
  selectedMember: TeamMember | null = null;

  availableMembers: AvailableMember[] = [];

  constructor(
    private userRoleService: UserRoleService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadAvailableMembers();
  }

  get filteredMembers() {
    const search = this.searchText.toLowerCase();
    return this.members.filter((member) =>
      (member.name ?? '').toLowerCase().includes(search)
    );
  }

  getInitials(name: string | undefined | null): string {
    if (!name) return '';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
    } else if (parts.length === 1) {
      return parts[0][0].toUpperCase();
    }
    return '';
  }

  openAddMemberModal() {
    this.showMemberModal = true;
    document.body.classList.add('modal-open');
  }

  saveMember(newMember: TeamMember) {
    this.userRoleService
      .assignUserRole(newMember.id, ROLE_ENUM.TeamMember, this.teamId)
      .subscribe({
        next: () => {
          console.log('User role assigned as Team Member');
          this.members.push(newMember);
        },
        error: (err) => {
          console.error('Failed to assign role:', err);
        },
      });

    this.showMemberModal = false;
    document.body.classList.remove('modal-open');
  }

  loadAvailableMembers(): void {
    this.userService.getAvailableUsers().subscribe({
      next: (response) => {
        this.availableMembers = response;
        console.log('Users');
        console.log(response);
      },
      error: (error) => {
        console.error('Failed to load available team members', error);
      },
    });
  }

  closeMemberModal() {
    this.showMemberModal = false;
    document.body.classList.remove('modal-open');
  }

  openDeleteMemberModal(index: number) {
    this.selectedMember = this.members[index];
    this.showDeleteModal = true;
    document.body.classList.add('modal-open');
  }

  confirmDeleteMember() {
    if (this.selectedMember && this.selectedMember.userRoleId !== undefined) {
      console.log('member to delete');
      console.log(this.selectedMember);
      this.userRoleService
        .removeTeamMember(this.selectedMember.userRoleId)
        .subscribe({
          next: () => {
            console.log('Member removed successfully');
            this.members = this.members.filter(
              (m) => m !== this.selectedMember
            );
          },
          error: (err) => {
            console.error('Failed to remove member:', err);
          },
        });
    } else {
      console.warn('Selected member is missing a valid userRoleId');
    }
    this.selectedMember = null;
    this.showDeleteModal = false;
    document.body.classList.remove('modal-open');
  }

  cancelDeleteMember() {
    this.selectedMember = null;
    this.showDeleteModal = false;
    document.body.classList.remove('modal-open');
  }
}
