import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Project } from '../models/project';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://hello-full-stack-be-f8ehd3erddgdfhhd.germanywestcentral-01.azurewebsites.net/auth';
  private currentUser: User | null = null;

  constructor(private http: HttpClient) { }

  async register(email: string, username: string, password: string) {
    const res = await fetch('https://hello-full-stack-be-f8ehd3erddgdfhhd.germanywestcentral-01.azurewebsites.net/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        username: username,
        password: password
      })
    });
    if (!res.ok) return false;
    return true;
  }

  async login(username: string, password: string): Promise<boolean> {
    try {
      const res = await lastValueFrom(
        this.http.post<{ accessToken: string, refreshToken: string }>(
          `${this.apiUrl}/login`,
          { username, password },
          { headers: { "Content-Type": "application/json" } }
        )
      );
      localStorage.setItem('accessToken', res.accessToken);
      localStorage.setItem('refreshToken', res.refreshToken);
      return true;
    } catch (err) {
      console.error('Login fallito', err);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      return false;
    }
  }

  async getUserProjects(): Promise<Project[]> {
    return lastValueFrom(
      this.http.get<Project[]>(`${this.apiUrl}/projects`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem('accessToken')}` }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    this.currentUser = null;
    localStorage.removeItem('user');
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    if (this.currentUser) return this.currentUser;
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    try {
      this.currentUser = JSON.parse(raw) as User;
      return this.currentUser;
    } catch {
      return null;
    }
  }

  setCurrentUser(user: User) {
    this.currentUser = user;
    localStorage.setItem('user', JSON.stringify(user));
  }
}
