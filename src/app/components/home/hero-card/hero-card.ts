import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hero-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hero-card.html',
  styleUrl: './hero-card.css',
})

export class HeroCard {
  @Input() page: 'home' | 'profile' = 'home';
  @Input() subtitle: string = '';
  @Input() title: string = '';
  @Input() buttonText: string = '';

  // Bottoni per creare progetti, fasi e task
  @Input() projectButtonText?: string;
  @Input() phaseButtonText?: string;
  @Input() taskButtonText?: string;

  @Output() createProject = new EventEmitter<void>();
  @Output() createPhase = new EventEmitter<void>();
  @Output() createTask = new EventEmitter<void>();

  @Output() saveProfile = new EventEmitter<void>();

  onCreateProject() {
    this.createProject.emit();
  }
  onCreatePhase() {
    this.createPhase.emit();
  }
  onCreateTask() {
    this.createTask.emit();
  }

  get heroImage(): string {
    return this.page === 'profile'
      ? '/materials/profileHero.png'
      : '/materials/progettoFigo.png';
  }

  onSaveProfile() {
    this.saveProfile.emit();
  }
}
