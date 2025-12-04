import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Sidebar } from "../../components/sidebar/sidebar";
import { HeroCard } from '../../components/hero-card/hero-card';

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

  constructor(private fb: FormBuilder) {
    this.nameForm = this.fb.group({
      displayName: ['', [Validators.required, this.noWhitespaceValidator]]
    });

    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.passwordForm = this.fb.group({
      passwordCurrent: ['', Validators.required],
      passwordNew: ['', [Validators.required]]
    }, { validators: this.passwordsNotEqual });
  }

  noWhitespaceValidator(control: AbstractControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  }

  passwordsNotEqual(group: AbstractControl) {
    const current = group.get('passwordCurrent')?.value;
    const newPass = group.get('passwordNew')?.value;
    return (current && newPass && current === newPass) ? { samePassword: true } : null;
  }

  saveName() {
    if (this.nameForm.valid) {
      console.log('Nome utente aggiornato:', this.nameForm.value.displayName);
      // TODO: chiamata al service per aggiornare il nome
    } else {
      this.nameForm.markAllAsTouched();
    }
  }

  saveEmail() {
    if (this.emailForm.valid) {
      console.log('Email aggiornata:', this.emailForm.value.email);
      // TODO: chiamata al service per aggiornare l'email
    } else {
      this.emailForm.markAllAsTouched();
    }
  }

  savePassword() {
    if (this.passwordForm.valid) {
      console.log('Password aggiornata:', this.passwordForm.value.passwordNew);
      // TODO: chiamata al service per aggiornare la password
      this.passwordForm.reset();
    } else {
      this.passwordForm.markAllAsTouched();
    }
  }
}
