import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Project } from '../../models/project';

@Component({
  selector: 'app-project-card',
  standalone: true,
  templateUrl: './project-card.html',
})
export class ProjectCard {
  @Input() project!: Project;
  @Output() edit = new EventEmitter<Project>();
  @Output() delete = new EventEmitter<Project>();
}
