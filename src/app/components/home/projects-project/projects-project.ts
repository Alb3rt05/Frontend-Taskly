import { Component, Input } from '@angular/core';
import { Project } from '../../../models/project';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-projects-project',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects-project.html',
  providers: [DatePipe]
})
export class ProjectCard {
  @Input() project!: Project;
  @Input() active: boolean = false;
}
