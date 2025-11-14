import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = 'http://localhost:8080/api'; // Quarkus backend URL
  private readonly tokenKey = 'taskly_token';

  constructor(private http: HttpClient) {}

  async login(email: string, password: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.post<{ token?: string }>(`${this.baseUrl}/auth/login`, {
          email,
          password
        })
      );

      if (response?.token) {
        this.safeSetToken(response.token);
        return true;
      }

      return false;
    } catch {
      return false;
    }
  }

  logout(): void {
    this.safeRemoveToken();
  }

  getToken(): string | null {
    return this.safeGetToken();
  }

  isAuthenticated(): boolean {
    return !!this.safeGetToken();
  }

  // -----------------------------------------
  // SAFE METHODS (fix per test & server-side)
  // -----------------------------------------

  private safeSetToken(token: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  private safeRemoveToken(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
    }
  }

  private safeGetToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }
}
