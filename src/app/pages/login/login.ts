import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {

  form: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    // redirect se già loggato
    if (this.auth.isAuthenticated()) {
      this.router.navigateByUrl('/home');
    }
  }

  async onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = null;

    const { username, password } = this.form.value;

    try {
      const ok = await this.auth.login(username, password);

      if (ok) {
        const token = this.auth.getToken();
        if (!token) {
          this.error = 'Token non ricevuto';
          return;
        }

        localStorage.setItem('token', token);

        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.sub;

        const profile = await fetch(`https://hello-full-stack-be-f8ehd3erddgdfhhd.germanywestcentral-01.azurewebsites.net/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(r => {
          if (!r.ok) throw new Error('Errore caricamento profilo');
          return r.json();
        });

        localStorage.setItem('user', JSON.stringify({
          id: userId,
          email: profile.username,
          name: profile.displayName
        }));

        this.router.navigateByUrl('/home');

      } else {
        this.error = 'Credenziali non valide';
      }
    } catch (err) {
      console.error(err);
      this.error = 'Errore durante il login';
    } finally {
      this.loading = false;
    }
  }
}
