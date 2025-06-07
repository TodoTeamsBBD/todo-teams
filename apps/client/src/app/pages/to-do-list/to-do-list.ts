import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskModal } from '../../components/task-modal/task-modal';
import { TaskDetailsModal } from '../../components/task-details-modal/task-details-modal';
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

interface Task {
  title: string;
  description?: string;
  createdBy?: string;
  assignedTo: string;
  teamId?: string;
  createdAt?: Date;
  completedAt?: Date | null;
  completed: boolean;
}

@Component({
  selector: 'app-to-do-list',
  imports: [
    CommonModule,
    FormsModule,
    TaskModal,
    TaskDetailsModal,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatIconModule,
  ],
  templateUrl: './to-do-list.html',
  styleUrls: ['./to-do-list.css'],
})
export class ToDoList implements OnInit, AfterViewInit {
  tasks: Task[] = [
    {
      title: 'Task 1',
      description: 'Task1 description',
      createdBy: 'lead user',
      assignedTo: 'Ray',
      teamId: '011',
      createdAt: new Date(),
      completedAt: null,
      completed: false,
    },
    {
      title: 'Task 2',
      description: 'Task2 description',
      createdBy: 'lead user',
      assignedTo: 'Octovia',
      teamId: '012',
      createdAt: new Date(),
      completedAt: null,
      completed: false,
    },
    {
      title: 'Task 3',
      description: 'Task3 description',
      createdBy: 'lead user',
      assignedTo: 'Shaz',
      teamId: '013',
      createdAt: new Date(),
      completedAt: null,
      completed: false,
    },
  ];

  showMyTasks: boolean = false;
  showCompletedTasks: boolean = false;
  filteredTasks: Task[] = [];

  showTaskModal = false;
  isEditMode = false;
  editIndex: number | null = null;

  deleteIndex: number | null = null;
  taskToDelete: any = null;
  // taskToDelete: Task | null = null;
  selectedTask: Task | null = null;

  showDeleteModal = false;

  taskForm = {
    title: '',
    description: '',
    assignedTo: '',
  };

  teamMembers = ['Ray', 'Octovia', 'Shaz'];

  currentUser = 'Ray'; // Example logged-in user

  displayedColumns: string[] = [
    'title',
    'assignedTo',
    'edit',
    'delete',
    'completed',
  ];
  pagedTasks = new MatTableDataSource<Task>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.applyFilters();
  }

  ngAfterViewInit(): void {
    this.pagedTasks.paginator = this.paginator;
  }

  applyFilters(): void {
    this.filteredTasks = this.tasks.filter((task) => {
      const matchesUser =
        !this.showMyTasks || task.assignedTo === this.currentUser;
      const matchesCompleted = !this.showCompletedTasks || task.completed;
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
    this.taskForm = { title: '', description: '', assignedTo: '' };
    this.isEditMode = false;
    this.editIndex = null;
    this.showTaskModal = true;
    document.body.classList.add('modal-open');
  }

  editTask(index: number): void {
    const { title, description = '', assignedTo } = this.tasks[index];
    this.taskForm = { title, description, assignedTo };
    this.isEditMode = true;
    this.editIndex = index;
    this.showTaskModal = true;
    document.body.classList.add('modal-open');
  }

  submitTask(task: any): void {
    if (this.isEditMode && this.editIndex !== null) {
      this.tasks[this.editIndex] = { ...this.tasks[this.editIndex], ...task };
    } else {
      this.tasks.push({
        ...task,
        createdBy: this.currentUser,
        createdAt: new Date(),
        completedAt: null,
        completed: false,
      });
    }
    this.applyFilters();
    this.closeModal();
  }

  closeModal(): void {
    this.showTaskModal = false;
    this.editIndex = null;
    this.taskForm = { title: '', description: '', assignedTo: '' };
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
        this.tasks.splice(actualIndex, 1);
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

  toggleCompletion(index: number) {
    this.tasks[index].completed = !this.tasks[index].completed;
  }
}
