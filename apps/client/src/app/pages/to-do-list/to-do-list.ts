import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TeamMembers } from '../../components/team-members/team-members';
import { TaskModal } from '../../components/task-modal/task-modal';
import { TaskDetailsModal } from '../../components/task-details-modal/task-details-modal';
import { DeleteModal } from '../../components/delete-modal/delete-modal';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ToDoService } from './to-do-list.service';
import { AuthService, UserState } from '../../services/authservice';
import { ActivatedRoute } from '@angular/router';
import { UserRoleService } from '../../services/user-role-service';
import {
  TeamMember,
  MemberRole,
} from '../../components/team-members/team-members';

export interface Task {
  id: number;
  title: string;
  description?: string;
  created_by?: string;
  assigned_to?: TeamMember;
  team_id?: number;
  created_at?: Date;
  completed_at?: Date | null;
}

export interface CreateTodoRequest {
  title: string;
  description: string;
  assignedTo?: TeamMember;
  teamId: number;
}

@Component({
  selector: 'app-to-do-list',
  imports: [
    CommonModule,
    FormsModule,
    TeamMembers,
    TaskModal,
    TaskDetailsModal,
    DeleteModal,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
  ],
  templateUrl: './to-do-list.html',
  styleUrls: ['./to-do-list.css'],
})
export class ToDoList implements OnInit, AfterViewInit {
  currentUser!: UserState;

  constructor(
    private todoService: ToDoService,
    private userRoleService: UserRoleService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  tasks: Task[] = [];

  sideNavOpened: boolean = true;
  showMyTasks: boolean = false;
  showCompletedTasks: boolean = false;
  filteredTasks: Task[] = [];
  showTaskModal: boolean = false;
  isEditMode: boolean = false;
  editIndex: number | null = null;
  deleteIndex: number | null = null;
  taskToDelete: any = null;
  selectedTask: Task | null = null;
  showDeleteModal: boolean = false;
  completed: boolean = false;
  teamId!: number;
  loadError: boolean = false;
  teamMembers: TeamMember[] = [];

  taskForm: Task = {
    id: 0,
    title: '',
    description: '',
  };

  displayedColumns: string[] = [
    'title',
    'assigned_to',
    'edit',
    'delete',
    'completed',
  ];
  pagedTasks = new MatTableDataSource<Task>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngOnInit(): void {
    this.authService.getCurrentUserState().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.route.queryParams.subscribe((params) => {
          const param = params['teamId'];
          this.teamId = param;
        });

        this.loadTeamMembers();

        this.loadTodos();
      },
      error: (err) => {
        console.error('Failed to fetch current user:', err);
      },
    });
  }

  ngAfterViewInit(): void {
    this.pagedTasks.paginator = this.paginator;
  }

  get teamMemberNames(): TeamMember[] {
    return this.teamMembers;
  }

  loadTodos(): void {
    if (this.teamId === null) {
      console.error('Team ID is not available. Cannot load todos.');
      return;
    }

    const teamId = this.teamId;
    const usersToDos = this.showMyTasks;
    const completedToDos = this.showCompletedTasks ? true : null;

    this.todoService
      .getTodosForTeam(teamId, usersToDos, completedToDos)
      .subscribe({
        next: (data) => {
          this.tasks = data.map((todo) => ({
            ...todo,
            assigned_to: this.teamMembers.find(
              (member) => member.id === todo.assigned_to
            ),
          }));

          this.loadError = false;
          this.applyFilters();
        },
        error: (err) => {
          this.loadError = true;
          console.error('Failed to load todos:', err);
        },
      });
  }

  loadTeamMembers(): void {
    if (this.teamId === null) {
      console.error('Team ID is not available. Cannot load team members.');
      return;
    }

    this.userRoleService.getUsersByTeam(this.teamId).subscribe({
      next: (response) => {
        this.teamMembers = response.members;
      },
      error: (error) => {
        console.error('Failed to load team members', error);
      },
    });
  }

  applyFilters(): void {
    this.filteredTasks = this.tasks.filter((task) => {
      const matchesUser =
        !this.showMyTasks || task.assigned_to?.id === this.currentUser.userId;

      const matchesCompleted = this.showCompletedTasks
        ? task.completed_at !== null
        : task.completed_at === null;

      return matchesUser && matchesCompleted;
    });

    this.pagedTasks.data = this.filteredTasks;
  }

  showTaskDetails(task: Task): void {
    this.selectedTask = task;
    document.body.classList.add('modal-open');
  }

  closeTaskDetails(): void {
    this.selectedTask = null;
    document.body.classList.remove('modal-open');
  }

  createTask(): void {
    this.taskForm = {
      id: 0,
      title: '',
      description: '',
      assigned_to: this.teamMembers.find(
        (member) => member.id === this.currentUser.userId
      ),
    };
    this.isEditMode = false;
    this.editIndex = null;
    this.showTaskModal = true;
    document.body.classList.add('modal-open');
  }

  editTask(index: number): void {
    const { id, title, description = '', assigned_to } = this.tasks[index];
    this.taskForm = { id, title, description, assigned_to: assigned_to };
    this.isEditMode = true;
    this.editIndex = index;
    this.showTaskModal = true;
    document.body.classList.add('modal-open');
  }

  submitTask(task: any): void {
    const newTodoRequestBody = {
      title: task.title,
      description: task.description,
      assignedTo: task.assigned_to.id,
      teamId: this.teamId,
    };

    if (this.isEditMode && this.editIndex !== null) {
      this.todoService
        .updateTodo(task.id, {
          title: task.title,
          description: task.description,
          assignedTo: task.assigned_to.id,
        })
        .subscribe({
          next: (updatedTodo) => {
            alert(`Todo updated.`);
            // this.tasks[this.editIndex] = {
            //   ...this.tasks[this.editIndex],
            //   ...task,
            // };

            this.loadTodos();
            this.closeModal();
          },
          error: (err) => {
            console.error('Update failed:', err);
          },
        });
    } else {
      this.todoService.createTodo(newTodoRequestBody).subscribe({
        next: (createdTodo) => {
          this.tasks.push({
            ...task,
            created_by: this.currentUser.userId,
            assigned_to: task.assigned_to.id,

            team_id: this.teamId,
            created_at: new Date(),
            completed_at: null,
          });
          this.loadTodos();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error creating todo:', err);
          alert('Failed to create task.');
        },
      });
    }
  }

  getUserIdByName(name: string): string {
    const member = this.teamMembers.find((m) => m.name === name);
    if (!member) throw new Error('Assigned user not found');
    return (member as any).id;
  }

  getUserNameById(user: string | TeamMember): string {
    const userId = typeof user === 'string' ? user : user.id;
    const member = this.teamMembers.find((m) => m.id === userId);
    return member ? member.name : 'Unknown';
  }

  closeModal(): void {
    this.showTaskModal = false;
    this.editIndex = null;
    this.taskForm = { id: 0, title: '' };
    document.body.classList.remove('modal-open');
  }

  deleteTask(index: number): void {
    this.taskToDelete = this.filteredTasks[index];
    this.showDeleteModal = true;
    document.body.classList.add('modal-open');
  }

  confirmDelete(): void {
    if (this.taskToDelete) {
      const actualIndex = this.tasks.indexOf(this.taskToDelete);
      if (actualIndex !== -1) {
        this.todoService.deleteTodo(this.taskToDelete.id).subscribe({
          next: () => {
            this.tasks.splice(actualIndex, 1);
            this.applyFilters();
          },
          error: (err) => {
            console.error('Error deleting todo:', err);
          },
        });
      }
    }
    this.taskToDelete = null;
    this.deleteIndex = null;
    this.showDeleteModal = false;
    this.applyFilters();
    document.body.classList.remove('modal-open');
  }

  cancelDelete(): void {
    this.deleteIndex = null;
    this.showDeleteModal = false;
    document.body.classList.remove('modal-open');
  }

  toggleCompletion(task: Task): void {
    const completed = task.completed_at ? 'true' : 'false';

    this.todoService.updateTodoStatus(task.id, { completed }).subscribe({
      next: (updatedTask) => {
        task.completed_at = completed === 'true' ? new Date() : null;
        this.applyFilters();
      },
      error: (err) => {
        console.error('Failed to toggle completion:', err);
      },
    });
  }

  getCurrentUserRole(): MemberRole | null {
    const member = this.teamMembers.find(
      (m) => m.id === this.currentUser.userId
    );
    return member ? member.role : null;
  }

  canEditOrDelete(task: Task): boolean {

    const role = this.getCurrentUserRole();
    if (role === 'TeamLead') return true;

    return task.assigned_to?.id === this.currentUser.userId;
  }

  isCurrentUserTeamLead(): boolean {
    if (!this.currentUser) {
      return false;
    }

    let curr = this.currentUser.userId;

    const currentMember = this.teamMembers.find((m) => m.id === curr);
    return currentMember?.role === 'TeamLead';
  }

  canToggleComplete(task: Task): boolean {
    return this.canEditOrDelete(task);
  }

  togglePanel(): void {
    this.sideNavOpened = !this.sideNavOpened;
  }
}
