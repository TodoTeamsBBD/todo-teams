import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from '../../services/config';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateTodoRequest } from '../to-do-list/to-do-list';

export interface Todo {
  id: number;
  title: string;
  description?: string;
  created_by: string;
  assigned_to: string;
  team_id: number;
  created_at: Date;
  completed_at?: Date;
}

@Injectable({
  providedIn: 'root',
})
export class ToDoService {
  private baseUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.baseUrl = this.configService.apiUrl;
  }

  getTodosForTeam(
    teamId: number,
    usersToDos: boolean,
    completedToDos: boolean | null
  ): Observable<Todo[]> {
    let params = new HttpParams().set('usersToDos', usersToDos.toString());

    if (completedToDos !== null) {
      params = params.set('completedToDos', completedToDos.toString());
    }

    return this.http.get<Todo[]>(`${this.baseUrl}/api/todos/team/${teamId}`, {
      params,
      withCredentials: true,
    });
  }

  getTodoById(todoId: number): Observable<Todo> {
    return this.http.get<Todo>(`${this.baseUrl}/api/todos/${todoId}`, {
      withCredentials: true,
    });
  }

  createTodo(data: CreateTodoRequest): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/todos`, data, {
      withCredentials: true,
    });
  }

  deleteTodo(todoId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/todos/${todoId}`, {
      withCredentials: true,
    });
  }

  updateTodo(
    id: number,
    data: {
      title: string;
      description: string;
      assignedTo: string;
    }
  ): Observable<Todo> {
    return this.http.put<Todo>(
      `${this.baseUrl}/api/todos/${id}`,
      {
        title: data.title,
        description: data.description,
        assignedTo: data.assignedTo,
      },
      { withCredentials: true }
    );
  }

  updateTodoStatus(
    id: number,
    payload: { completed: string }
  ): Observable<Todo> {
    return this.http.put<Todo>(`${this.baseUrl}/api/todos/${id}`, payload, {
      withCredentials: true,
    });
  }
}
