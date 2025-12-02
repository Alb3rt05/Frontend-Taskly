import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:8080/auth'; 
  private tokenKey = 'taskly_access';
  private refreshKey = 'taskly_refresh';

  constructor(private http: HttpClient) {}

  async login(username: string, password: string): Promise<boolean> {
    try {
      const response: any = await firstValueFrom(
        this.http.post(`${this.baseUrl}/login`, { username, password })
      );

      if (response?.accessToken) {
        localStorage.setItem(this.tokenKey, response.accessToken);
        localStorage.setItem(this.refreshKey, response.refreshToken);
        return true;
      }
      return false;

    } catch {
      return false;
    }
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshKey);
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated() {
    return !!localStorage.getItem(this.tokenKey);
  }
}
