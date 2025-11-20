import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [FormsModule],
  template: `
    <section style="max-width:400px;margin:auto;padding-top:4rem;">
      <h2>Accedi</h2>

      <form (ngSubmit)="submit()">
        <input type="email" [(ngModel)]="email" name="email" placeholder="Email" required />
        <br /><br />
        <input type="password" [(ngModel)]="password" name="password" placeholder="Password" required />
        <br /><br />

        <button type="submit">Login</button>

        @if (error) {
          <p style="color:red;">Credenziali non valide</p>
        }
      </form>
    </section>
  `
})
export class LoginPage {
  email = '';
  password = '';
  error = false;

  constructor(private auth: AuthService, private router: Router) {}

  async submit() {
    const ok = await this.auth.login(this.email, this.password);
    if (ok) this.router.navigateByUrl('/');
    else this.error = true;
  }
}
