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

    const ok = await this.auth.login(username, password);

    if (ok) {
      this.router.navigateByUrl('/home'); // redirect a home protetta
    }
    else {
      this.error = 'Credenziali non valide';
    }

    this.loading = false;
  }
}
