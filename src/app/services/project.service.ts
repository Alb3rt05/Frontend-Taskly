import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Project } from '../models/project';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})

export class ProjectService {
  private apiUrl = 'https://hello-full-stack-be-f8ehd3erddgdfhhd.germanywestcentral-01.azurewebsites.net';
  constructor(private http: HttpClient) { }

  // Recupera l'ID dell'utente dal token
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

  // Carica progetti dell'utente
  async getUserProjects(): Promise<Project[]> {
    const userId = this.getUserIdFromToken();
    if (!userId) {
      console.error('No user id found in token.');
      return [];
    }
    const url = `${this.apiUrl}/projects/owner/${userId}`;
    return lastValueFrom(this.http.get<Project[]>(url));
  }
  // Crea progetto
  async createProject(title: string) {
    const url = `${this.apiUrl}/projects`;
    return lastValueFrom(this.http.post(url, { title }));
  }
  // Elimina progetto
  async deleteProject(projectId: string) {
    const url = `${this.apiUrl}/projects/${projectId}`;
    return lastValueFrom(this.http.delete(url));
  }
  // Aggiunge membro a progetto
  addMemberToProject(projectId: string, email: string) {
    const url = `${this.apiUrl}/projects/${projectId}/members`;
    return this.http.post(url, { email });
  }
}