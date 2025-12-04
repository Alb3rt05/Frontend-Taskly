import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../services/task.service';
import { Task } from '../../../models/task';
import { Phase } from '../../../models/phase';

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
  @Input() phases: Phase[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() updated = new EventEmitter<void>();

  title!: string;
  description!: string;
  phaseId!: string;
  dueDate!: string;

  ngOnInit() {
    this.title = this.task.title;
    this.description = this.task.description || '';
    this.phaseId = this.task.phaseId || '';
    this.dueDate = this.task.dueDate ? new Date(this.task.dueDate).toISOString().split('T')[0] : '';
  }

  async submit() {
    if (!this.title.trim() || !this.phaseId) return;
    try {
      await this.taskService.updateTask(
        this.task.id!,
        {
          title: this.title.trim(),
          description: this.description,
          phaseId: this.phaseId,
          dueDate: this.dueDate ? new Date(this.dueDate).toISOString() : undefined, // backend vuole 2025-12-04T10:22:00.000Z

          projectId: this.task.projectId!,
          status: this.task.status,
          assigneeIds: this.task.assignees ?? []
        }
      );
      this.updated.emit();
      this.close.emit();
    } catch (err) {
      console.error('Errore modificando task', err);
    }
  }

  cancel() {
    this.close.emit();
  }
}
