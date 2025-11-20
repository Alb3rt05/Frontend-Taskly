import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav style="padding: 1rem; background:#222; color:white;">
      <span style="font-weight:bold;">Taskly</span>

      @if (auth.isAuthenticated()) {
        <button (click)="logout()" style="float:right;">Logout</button>
      }
    </nav>
  `
})
export class Navbar {
  constructor(public auth: AuthService, private router: Router) {}

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
