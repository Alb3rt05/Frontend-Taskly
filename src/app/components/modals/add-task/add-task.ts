import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../../services/project.service';
import { Phase } from '../../../models/phase';
import { TaskRequest } from '../../../services/task.service';
import { lastValueFrom } from 'rxjs';
import { TaskService } from '../../../services/task.service';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-task.html',
  styleUrls: ['../add-project/add-project.css']
})
export class AddTask {
  taskService = inject(TaskService); // <- qui

  @Input() projectId!: string;
  @Input() phases: Phase[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();

  title = '';
  description = '';
  phaseId = '';
  dueDate = '';

  async submit() {
    if (!this.title.trim() || !this.phaseId) return;

    const task: TaskRequest = {
      projectId: this.projectId,
      phaseId: this.phaseId,
      title: this.title.trim(),
      description: this.description,
      dueDate: this.dueDate,
      status: 'TODO',
      assigneeIds: []
    };

    try {
      await lastValueFrom(this.taskService.createTask(task)); // ora funziona
      this.created.emit();
      this.close.emit();
    } catch (err) {
      console.error('Errore creando task', err);
    }
  }

  cancel() {
    this.close.emit();
  }
}
