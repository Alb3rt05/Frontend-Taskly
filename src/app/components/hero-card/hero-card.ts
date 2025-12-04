import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-hero-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-card.html',
  styleUrl: './hero-card.css',
})

export class HeroCard {
  @Output() createProject = new EventEmitter<void>();

  onCreateProject() {
    this.createProject.emit();
  }
}
