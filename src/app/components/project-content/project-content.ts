import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectPhase } from '../../models/projectPhase';
import { Task } from '../../models/task';

@Component({
  selector: 'app-project-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-content.html',
})
export class ProjectContent {
  @Input() phase!: ProjectPhase;

  // helper per visualizzare titolo 
  taskTitle(t: Task) {
    return t.title || '(no title)';
  }
}
