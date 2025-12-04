import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
// Services
import { ProjectService } from '../../services/project.service';
// Components
import { Sidebar } from '../../components/sidebar/sidebar';
import { HeroCard } from '../../components/hero-card/hero-card';
import { ProjectCard } from '../../components/project-card/project-card';
import { ProjectContent } from '../../components/project-content/project-content';
// Interfaces
import { Project } from '../../models/project';
import { Task } from '../../models/task';
import { ProjectPhase } from '../../models/projectPhase';
import { Phase } from '../../models/phase';
// Modals
import { AddProject } from '../../components/modals/add-project/add-project';
import { AddTask } from '../../components/modals/add-task/add-task';
import { EditTask } from '../../components/modals/edit-task/edit-task';
import { EditProject } from '../../components/modals/edit-project/edit-project';
import { lastValueFrom } from 'rxjs';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    Sidebar,
    HeroCard,
    ProjectCard,
    ProjectContent,
    AddProject,
    AddTask,
    EditTask,
    EditProject
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  projectService = inject(ProjectService);
  projects: Project[] = [];
  projectPhases: ProjectPhase[] = [];
  selectedProjectIndex = 0;

  // Modals
  showAddProjectModal = false;
  showEditProjectModal = false;
  selectedProjectForEdit: Project | null = null;

  showAddTaskModal = false;
  showEditTaskModal = false;
  selectedPhaseForTask: string | null = null;
  selectedTaskForEdit: Task | null = null;
  selectedProjectForDelete: Project | null = null;
  showDeleteProjectModal: boolean = false;

  ngOnInit(): void {
    this.loadProjects();
  }

  async loadProjects() {
    try {
      const rawProjects = await this.projectService.getUserProjects();
      this.projects = rawProjects.map((p, idx) => ({
        ...p,
        active: idx === 0,
        id: p.id ?? p._id?.$oid ?? p._id // <- Normalizziamo ID subito
      }));
      if (this.projects.length > 0) await this.loadProjectDetails(0);
    } catch (err) {
      console.error('Errore caricando progetti:', err);
    }
  }

  async loadProjectDetails(index: number) {
    const project = this.projects[index];
    if (!project) return;

    try {
      const projectId = project.id ?? project._id?.$oid ?? project._id ?? null;
      const tasks = projectId ? await this.projectService.getTasksForProject(projectId) : [];

      const normalizedTasks: Task[] = (tasks || []).map(t => {
        const id = (t as any)._id ? ((t as any)._id.$oid || (t as any)._id) : (t as any).id;
        return { ...t, id };
      });

      project.tasks = normalizedTasks;

      const phases: Phase[] = project.phases || [];
      phases.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      this.projectPhases = phases.map(phase => {
        const phaseTasks = normalizedTasks.filter(t => t.phaseId === phase.id);
        const todo = phaseTasks.filter(t => !(t.status?.toLowerCase().includes('done')));
        const done = phaseTasks.filter(t => t.status?.toLowerCase().includes('done'));
        return {
          name: phase.title,
          phaseId: phase.id,
          tasks: todo || [],
          tasksDone: done || []
        };
      });

    } catch (err) {
      console.error('Errore caricando dettagli progetto:', err);
      this.projectPhases = [];
    }
  }

  private getEntityId(entity: any): string | null {
    if (!entity) return null;
    if (typeof entity.id === 'string') return entity.id;
    if (entity._id) {
      if (typeof entity._id === 'string') return entity._id;
      if (entity._id.$oid) return entity._id.$oid;
      if (typeof entity._id.toString === 'function') return entity._id.toString();
    }
    return null;
  }

  // Project
  openAddProjectModal() { 
    this.showAddProjectModal = true; 
  }
  closeAddProjectModal(created?: boolean) {
    this.showAddProjectModal = false;
    if (created) this.loadProjects();
  }
  openDeleteProjectModal(project: Project) {
    this.selectedProjectForDelete = project;
    this.showDeleteProjectModal = true;
  }
  closeDeleteProjectModal(deleted?: boolean) {
    this.showDeleteProjectModal = false;
    this.selectedProjectForDelete = null;
    if (deleted) this.loadProjects();
  }
  editProject(project: Project) {
    this.selectedProjectForEdit = project;
    this.showEditProjectModal = true;
  }
  closeEditProjectModal(updated?: boolean) {
    this.showEditProjectModal = false;
    this.selectedProjectForEdit = null;
    if (updated) this.loadProjects();
  }

  async deleteProject(project: Project) {
    if (!confirm(`Eliminare il progetto "${project.title}"?`)) return;

    try {
      const projectId = this.getEntityId(project);
      if (!projectId) throw new Error('ID progetto non trovato');
      await this.projectService.deleteProject(projectId);
      await this.loadProjects();
    } catch (err) {
      console.error('Errore eliminando progetto:', err);
    }
  }

  selectProject(i: number) {
    this.projects = this.projects.map((p, idx) => ({ ...p, active: idx === i }));
    this.selectedProjectIndex = i;
    this.loadProjectDetails(i);
  }

  // Task
  openAddTaskModal(phaseId: string) {
    this.selectedPhaseForTask = phaseId;
    this.showAddTaskModal = true;
  }

  closeAddTaskModal(taskCreated?: boolean) {
    this.showAddTaskModal = false;
    if (taskCreated) this.loadProjectDetails(this.selectedProjectIndex);
  }

  openEditTaskModal(task: Task) {
    this.selectedTaskForEdit = task;
    this.showEditTaskModal = true;
  }

  closeEditTaskModal(taskUpdated?: boolean) {
    this.showEditTaskModal = false;
    if (taskUpdated) this.loadProjectDetails(this.selectedProjectIndex);
  }

  taskService = inject(TaskService);
  async deleteTask(task: Task) {
    if (!confirm(`Eliminare il task "${task.title}"?`)) return;
    try {
      await lastValueFrom(this.taskService.deleteTask(task.id!));
      await this.loadProjectDetails(this.selectedProjectIndex);
    } catch (err) {
      console.error('Errore eliminando task:', err);
    }
  }
}
