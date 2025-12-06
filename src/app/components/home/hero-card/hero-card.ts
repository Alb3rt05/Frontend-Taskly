import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-hero-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-card.html',
  styleUrl: './hero-card.css',
})

export class HeroCard {
  @Input() subtitle: string = '';
  @Input() title: string = '';
  @Input() buttonText: string = '';
  @Output() createProject = new EventEmitter<void>();
  @Output() saveProfile = new EventEmitter<void>();

  onCreateProject() {
    this.createProject.emit();
  }

  onSaveProfile() {
    this.saveProfile.emit();
  }
}
