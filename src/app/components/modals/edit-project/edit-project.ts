import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../../services/project.service';
import { Project } from '../../../models/project';

@Component({
  selector: 'app-edit-project',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-project.html',
  styleUrls: ['../add-project/add-project.css']
})
export class EditProject {
  projectService = inject(ProjectService);

  @Input() project!: Project;
  @Output() close = new EventEmitter<void>();
  @Output() updated = new EventEmitter<void>();

  title!: string;

  ngOnInit() {
    this.title = this.project.title;
  }

  async submit() {
    const projectId = this.project.id ?? this.project._id?.$oid ?? this.project._id;
    if (!projectId) throw new Error('Project ID non trovato');

    try {
      await this.projectService.updateProject({
        ...this.project,
        id: projectId, // <- assicuriamo che ci sia l'id come stringa
        title: this.title.trim(),
      });
      this.updated.emit();
      this.close.emit();
    } catch (err) {
      console.error('Errore modificando progetto', err);
    }
  }

  cancel() {
    this.close.emit();
  }
}
