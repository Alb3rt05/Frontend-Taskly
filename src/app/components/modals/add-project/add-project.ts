import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../../services/project.service';

@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-project.html',
  styleUrls: ['./add-project.css']
})
export class AddProject {
  projectService = inject(ProjectService);

  title = '';
  @Output() close = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();

  async submit() {
    if (!this.title.trim()) return;
    try {
      await this.projectService.createProject(this.title.trim());
      this.created.emit();
      this.close.emit();
    } catch (err) {
      console.error('Errore creando progetto', err);
    }
  }

  cancel() {
    this.close.emit();
  }
}
