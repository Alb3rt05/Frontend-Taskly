import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
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
  id?: string;
  projectId: string;
  phaseId: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  dueDate?: string | null;
  assigneesIds?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = 'https://hello-full-stack-be-f8ehd3erddgdfhhd.germanywestcentral-01.azurewebsites.net';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error("Utente non autenticato");
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // Recupera tutte le task di un progetto
  getTasksByProject(projectId: string): Observable<Task[]> {
    return this.http.get<TaskResponse[]>(`${this.apiUrl}/tasks/project/${projectId}`)
      .pipe(
        map(list => list.map(t => ({
          id: t.id,
          projectId: t.projectId,
          phaseId: t.phaseId,
          title: t.title,
          description: t.description,
          assignees: t.assignees || [],
          dueDate: t.dueDate,
          status: t.status as "TODO" | "IN_PROGRESS" | "DONE",
          createdAt: t.createdAt
        })))
      );
  }

  getTasksByPhase(phaseId: string): Observable<Task[]> {
    return this.http.get<TaskResponse[]>(`${this.apiUrl}/tasks/phase/${phaseId}`)
      .pipe(
        map(list => list.map(t => ({
          id: t.id,
          projectId: t.projectId,
          phaseId: t.phaseId,
          title: t.title,
          description: t.description,
          assignees: t.assignees || [],
          dueDate: t.dueDate,
          status: t.status as "TODO" | "IN_PROGRESS" | "DONE",
          createdAt: t.createdAt
        })))
      );
  }

  createTask(task: TaskRequest): Observable<TaskResponse> {
    const headers = this.getAuthHeaders();
    const payload = {
      ...task,
      assigneesIds: task.assigneesIds ?? []
    };
    return this.http.post<TaskResponse>(`${this.apiUrl}/tasks`, payload, { headers });
  }

  updateTask(taskId: string, task: TaskRequest): Observable<TaskResponse> {
    const headers = this.getAuthHeaders();
    return this.http.put<TaskResponse>(`${this.apiUrl}/tasks/${taskId}`, task, { headers });
  }

  deleteTask(taskId: string) {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/tasks/${taskId}`, { headers });
  }

  // Aggiunge un assignee alla task
  assignTask(taskId: string, assigneeIds: string[]): Observable<TaskResponse> {
    return this.http.put<TaskResponse>(
      `${this.apiUrl}/tasks/${taskId}/assign`,
      assigneeIds
    );
  }
}
