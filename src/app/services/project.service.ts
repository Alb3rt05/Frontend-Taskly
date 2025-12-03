import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Project } from '../models/project';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})

export class ProjectService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  // decodifica payload JWT senza verifica per leggere l'user id
  private getUserIdFromToken(): string | null {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return null;
      const parts = token.split('.');
      if (parts.length < 2) return null;
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      // prova diverse chiavi (sub, userId, id)
      return payload.sub || payload.userId || payload.id || null;
    } catch (e) {
      console.warn('Cannot decode token', e);
      return null;
    }
  }

  async getUserProjects(): Promise<Project[]> {
    const userId = this.getUserIdFromToken();
    if (!userId) {
      console.error('No user id found in token.');
      return [];
    }
    const url = `${this.apiUrl}/projects/owner/${userId}`;
    return lastValueFrom(this.http.get<Project[]>(url));
  }

  async createProject(title: string) {
    const url = `${this.apiUrl}/projects`;
    // Il backend si aspetta ProjectRequest (title + opzionali)
    return lastValueFrom(this.http.post(url, { title }));
  }

  async getTasksForProject(projectId: string | null): Promise<Task[]> {
    if (!projectId) {
      console.error('Project id not found or undefined.');
      return [];
    }
    const urlCandidate1 = `${this.apiUrl}/tasks`;
    const params = new HttpParams().set('projectId', projectId);
    try {
      // prova GET /tasks?projectId=...
      const tasks = await lastValueFrom(this.http.get<Task[]>(urlCandidate1, { params }));
      if (Array.isArray(tasks)) return tasks;
    } catch (err) {
      // Tenta fallback
    }

    try {
      // fallback a /projects/{id}/tasks
      const urlCandidate2 = `${this.apiUrl}/projects/${projectId}/tasks`;
      const tasks = await lastValueFrom(this.http.get<Task[]>(urlCandidate2));
      if (Array.isArray(tasks)) return tasks;
    } catch (err) {
      // fallback finale: ritorna []
    }

    console.warn(`No tasks endpoint found for project ${projectId}. Returning empty array.`);
    return [];
  }
}