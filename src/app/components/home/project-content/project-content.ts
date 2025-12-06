import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../../models/task';

@Component({
  selector: 'app-project-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-content.html',
})
export class TaskCard {
  taskTitle(t: Task) {
    return t.title || '(no title)';
  }
}
