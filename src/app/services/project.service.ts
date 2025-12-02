import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'http://localhost:8080/projects';

  constructor(private http: HttpClient) {}

  async getUserProjects() {
    return lastValueFrom(this.http.get<any[]>(this.apiUrl));
  }

  async createProject(title: string) {
    return lastValueFrom(this.http.post(this.apiUrl, { title }));
  }
}
