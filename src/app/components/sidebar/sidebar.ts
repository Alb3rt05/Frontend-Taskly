import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})


export class Sidebar {

  user = { name: '', email: '' };

  constructor(private router: Router) {
    const stored = localStorage.getItem('user');
    console.log('Stored user:', stored);
    if (stored) {
      this.user = JSON.parse(stored);
    }
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  goProfile() {
    this.router.navigate(['/profile']);
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  get avatarLetter(): string {
    return this.user.name ? this.user.name[0].toUpperCase() : '';
  }

  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }
}
