import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task';

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
  private apiUrl = 'https://hello-full-stack-be-f8ehd3erddgdfhhd.germanywestcentral-01.azurewebsites.net'; // aggiorna con il backend

  constructor(private http: HttpClient) { }

  // Recupera tutte le task di un progetto
  getTasksByProject(projectId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/tasks/project/${projectId}`);
  }
  // Recupera una singola task
  createTask(task: TaskRequest): Observable<TaskResponse> {
    return this.http.post<TaskResponse>(`${this.apiUrl}/tasks`, task);
  }
  // Aggiorna una task
  updateTask(taskId: string, task: TaskRequest): Observable<TaskResponse> {
    return this.http.put<TaskResponse>(`${this.apiUrl}/tasks/${taskId}`, task);
  }
  // Elimina una task
  deleteTask(taskId: string) {
    return this.http.delete(`/api/tasks/${taskId}`);
  }
  // Assegna una task
  assignTask(taskId: string, assigneeIds: string[]): Observable<TaskResponse> {
    return this.http.put<TaskResponse>(`${this.apiUrl}/tasks/${taskId}/assign`, assigneeIds);
  }
}