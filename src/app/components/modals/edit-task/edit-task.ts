import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService, TaskRequest, TaskResponse } from '../../../services/task.service';
import { Task } from '../../../models/task';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-task.html',
  styleUrls: ['../add-project/add-project.css']
})
export class EditTask {
  taskService = inject(TaskService);

  @Input() task!: Task;
  @Input() phases: { id: string; title: string }[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() updated = new EventEmitter<void>();

  title = '';
  description = '';
  phaseId = '';
  dueDate = '';

  ngOnInit() {
    this.title = this.task.title;
    this.description = this.task.description || '';
    this.phaseId = this.task.phaseId!;
    this.dueDate = this.task.dueDate ? this.task.dueDate.split('T')[0] : '';
  }

  async submit() {
    if (!this.title.trim() || !this.phaseId) return;

    const taskReq: TaskRequest = {
      projectId: this.task.projectId!,
      phaseId: this.phaseId,
      title: this.title.trim(),
      description: this.description,
      dueDate: this.dueDate,
      status: this.task.status,
      assigneeIds: this.task.assignees || []
    };

    try {
      await lastValueFrom(this.taskService.updateTask(this.task.id!, taskReq));
      this.updated.emit();
      this.close.emit();
    } catch (err) {
      console.error('Errore aggiornando task', err);
    }
  }

  cancel() {
    this.close.emit();
  }
}
