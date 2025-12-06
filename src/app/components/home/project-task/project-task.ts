import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../../models/task';

@Component({
  selector: 'app-project-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-task.html',
})
export class TaskCard {
  @Input() task!: Task;
  @Output() onDelete = new EventEmitter<Task>();

  deleteTask(task: Task) {
    this.onDelete.emit(task);
  }
}
