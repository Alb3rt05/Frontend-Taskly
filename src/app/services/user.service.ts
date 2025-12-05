import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UpdateUserRequest } from '../models/update-user-request';
import { User } from '../models/user';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private api = 'https://hello-full-stack-be-f8ehd3erddgdfhhd.germanywestcentral-01.azurewebsites.net';

  constructor(private http: HttpClient) {}

  getProfile(userId: string): Observable<User> {
    return this.http.get<User>(`${this.api}/user/${userId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
    });
  }

  updateProfile(payload: UpdateUserRequest) {
    return this.http.put<User>(`${this.api}/user`, payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
    });
  }
}
