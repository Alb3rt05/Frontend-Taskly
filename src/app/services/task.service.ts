import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TaskResponse {
  id: string;
  projectId: string;
  phaseId: string;
  title: string;
  description: string;
  status: string;
  assignees: string[];
  dueDate: string;
  createdAt: string;
}

export interface TaskRequest {
  projectId: string;
  phaseId: string;
  title: string;
  description?: string;
  dueDate?: string;
  status?: string;
  assigneeIds?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = 'http://localhost:8080'; // aggiorna con il backend

  constructor(private http: HttpClient) { }

  createTask(task: TaskRequest): Observable<TaskResponse> {
    return this.http.post<TaskResponse>(`${this.apiUrl}/tasks`, task);
  }

  updateTask(taskId: string, task: TaskRequest): Observable<TaskResponse> {
    return this.http.put<TaskResponse>(`${this.apiUrl}/tasks/${taskId}`, task);
  }

  deleteTask(taskId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tasks/${taskId}`);
  }

  assignTask(taskId: string, assigneeIds: string[]): Observable<TaskResponse> {
    return this.http.put<TaskResponse>(`${this.apiUrl}/tasks/${taskId}/assign`, assigneeIds);
  }
}
