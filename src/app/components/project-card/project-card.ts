import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Project } from '../../models/project';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-card.html',
  providers: [DatePipe]
})
export class ProjectCard {
  @Input() project!: Project;
  @Output() edit = new EventEmitter<Project>();
  @Output() delete = new EventEmitter<Project>();
}
