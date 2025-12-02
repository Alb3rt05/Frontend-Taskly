import { Component, Input } from '@angular/core';
import { ProjectPhase } from '../../models/ProjectPhase';

@Component({
  selector: 'app-project-content',
  standalone: true,
  templateUrl: './project-content.html',
})
export class ProjectContent {
  @Input() phase!: ProjectPhase;
}
