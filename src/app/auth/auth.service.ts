import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) { }

  // Login e salvataggio token
  async login(username: string, password: string): Promise<boolean> {
    try {
      const res = await lastValueFrom(
        this.http.post<{ accessToken: string, refreshToken: string }>(
          `${this.apiUrl}/login`,
          { username, password },
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
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

  // Logout
  logout(): void {
    localStorage.removeItem('accessToken');
  }

  // Recupero token
  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  // Controllo autenticazione
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
