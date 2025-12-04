import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Input() phase: ProjectPhase = { name: '', tasks: [], tasksDone: [] };
  @Output() editTask = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<Task>();
  @Output() addTask = new EventEmitter<string>();

  taskTitle(t: Task) {
    return t.title || '(no title)';
  }
}
