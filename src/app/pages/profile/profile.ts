import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Sidebar } from "../../components/home/sidebar/sidebar";
import { HeroCard } from '../../components/home/hero-card/hero-card';
import { UserService } from '../../services/user.service';

@Component({
  standalone: true,
  selector: 'app-profile',
  imports: [ReactiveFormsModule, CommonModule, Sidebar, HeroCard],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
})
export class Profile {

  nameForm: FormGroup;
  emailForm: FormGroup;
  passwordForm: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService) {

    this.nameForm = this.fb.group({
      displayName: ['', [Validators.required, this.noWhitespaceValidator]]
    });

    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.passwordForm = this.fb.group({
      passwordCurrent: ['', Validators.required],
      passwordNew: ['', Validators.required]
    }, { validators: this.passwordsNotEqual });
  }

  noWhitespaceValidator(control: AbstractControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  }

  passwordsNotEqual(group: AbstractControl) {
    const current = group.get('passwordCurrent')?.value;
    const next = group.get('passwordNew')?.value;

    return current === next ? { samePassword: true } : null;
  }

  saveName() {
    if (this.nameForm.invalid) {
      this.nameForm.markAllAsTouched();
      return;
    }

    this.userService.updateProfile({
      displayName: this.nameForm.value.displayName
    }).subscribe(res => {
      console.log("Nome aggiornato:", res);
      alert('Nome aggiornato con successo');

      const u = JSON.parse(localStorage.getItem('user')!);
      u.name = res.displayName;
      localStorage.setItem('user', JSON.stringify(u));
    });
  }

  saveEmail() {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }

    this.userService.updateProfile({
      username: this.emailForm.value.email
    }).subscribe(res => {
      console.log("Email aggiornata:", res);
      alert('Email aggiornata con successo');

      const user = JSON.parse(localStorage.getItem('user')!);
      user.email = res.username;
      localStorage.setItem('user', JSON.stringify(user));
    });
  }

  savePassword() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.userService.updateProfile({
      passwordCurrent: this.passwordForm.value.passwordCurrent,
      passwordNew: this.passwordForm.value.passwordNew
    }).subscribe({
      next: res => {
        console.log("Password aggiornata:", res);
        this.passwordForm.reset();
        alert('Password aggiornata con successo');
      },
      error: err => {
        console.error('Errore cambio password', err);
        if (err?.status === 401) {
          alert('La password attuale non è corretta.');
        } else {
          alert('Errore durante il cambio password. Riprova.');
        }
      }
    });
  }

}
