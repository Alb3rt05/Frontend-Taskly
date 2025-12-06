// Angular
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Services
import { ProjectService } from '../../services/project.service';
import { TaskService } from '../../services/task.service';
// Components
import { Sidebar } from '../../components/home/sidebar/sidebar';
import { HeroCard } from '../../components/home/hero-card/hero-card';
import { ProjectCard } from '../../components/home/projects-project/projects-project';
import { PhaseCard } from "../../components/home/project-phase/project-phase";
// Models
import { Project } from '../../models/project';
import { Task } from '../../models/task';
import { Phase } from '../../models/phase';
// Helpers
import { lastValueFrom } from 'rxjs';

// INTERFACCIA FASE + TASKS
export interface PhaseWithTasks extends Phase {
  tasks: Task[];
  tasksDone: Task[];
  active?: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Sidebar,
    HeroCard,
    ProjectCard,
    PhaseCard
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {

  /* ==================== CARICAMENTO BASE DEI PROGETTI ==================== */
  projectService = inject(ProjectService);
  taskService = inject(TaskService);

  projects: Project[] = [];              // Array di progetti
  PhaseWithTasks: PhaseWithTasks[] = [];  // Array di fasi con task
  selectedProjectIndex = 0;              // Indice progetto selezionato
  selectedPhaseIndex = 0;                // Indice fase selezionata
  selectedTaskIndex = 0;                 // Indice task selezionato

  ngOnInit(): void {
    this.loadProjects();
  }

  async loadProjects() {
    try {
      const rawProjects = await this.projectService.getUserProjects();
      this.projects = rawProjects.map((p, idx) => ({
        ...p,
        members: p.members || [],
        active: idx === 0
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
      const phases: Phase[] = project.phases || [];
      phases.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      let tasks: Task[] = [];
      try {
        tasks = await lastValueFrom(this.taskService.getTasksByProject(project.id!));
      } catch (e) {
        console.warn("Tasks non disponibili, fasi in caricamento...");
      }

      this.PhaseWithTasks = phases.map((p, idx) => ({
        ...p,
        active: idx === 0,
        tasks: tasks.filter(t => t.phaseId === p.id),
        tasksDone: tasks.filter(t => t.phaseId === p.id && t.status === 'done')
      }));
    } catch (err) {
      console.error('Errore caricando dettagli progetto:', err);
      this.PhaseWithTasks = [];
    }
  }

  /* ==================== OVERLAY PROGETTI ==================== */
  showAddProjectModal = false;
  newProjectTitle = '';
  loadingCreateProject = false;
  createProjectError: string | null = null;

  openAddProjectModal() {
    this.showAddProjectModal = true;
    this.newProjectTitle = '';
    this.createProjectError = null;
  }

  closeAddProjectModal(created?: boolean) {
    this.showAddProjectModal = false;
    if (created) this.loadProjects();
  }

  async createProject() {
    if (!this.newProjectTitle) {
      this.createProjectError = 'Il titolo è obbligatorio';
      return;
    }
    this.loadingCreateProject = true;
    this.createProjectError = null;
    try {
      await this.projectService.createProject(this.newProjectTitle);
      this.closeAddProjectModal(true);
    } catch (err) {
      console.error(err);
      this.createProjectError = 'Errore creando progetto';
    } finally {
      this.loadingCreateProject = false;
    }
  }

  showDeleteProjectModal = false;
  selectedProjectForDelete: Project | null = null;

  openDeleteProjectModal(project: Project) {
    if (!project.id) return;
    this.selectedProjectForDelete = project;
    this.showDeleteProjectModal = true;
  }

  closeDeleteProjectModal(deleted?: boolean) {
    this.showDeleteProjectModal = false;
    this.selectedProjectForDelete = null;
    if (deleted) this.loadProjects();
  }

  async deleteProject() {
    if (!this.selectedProjectForDelete) return;
    try {
      await this.projectService.deleteProject(this.selectedProjectForDelete.id!);
      this.closeDeleteProjectModal(true);
    } catch (err) {
      console.error('Errore eliminando progetto:', err);
    }
  }

  selectProject(i: number) {
    this.projects = this.projects.map((p, idx) => ({ ...p, active: idx === i }));
    this.selectedProjectIndex = i;
    this.loadProjectDetails(i);
  }

  /* ==================== OVERLAY FASE ==================== */
  phaseToDelete: PhaseWithTasks | undefined;
  showDeletePhaseModal: boolean | undefined;

  selectPhase(i: number) {
    this.PhaseWithTasks = this.PhaseWithTasks.map((p, idx) => ({ ...p, active: idx === i }));
    this.selectedPhaseIndex = i;
  }

  openDeletePhaseModal(phase: PhaseWithTasks) {
    this.phaseToDelete = phase;
    this.showDeletePhaseModal = true;
  }

  async deletePhase() {
    if (!this.phaseToDelete) return;
    const projectId = this.projects[this.selectedProjectIndex].id!;
    try {
      await lastValueFrom(this.projectService.deletePhase(projectId, this.phaseToDelete.id));
      await this.loadProjectDetails(this.selectedProjectIndex);
      this.showDeletePhaseModal = false;
    } catch (err) {
      console.error('Errore eliminando fase:', err);
    }
  }

  get tasksOfSelectedPhase(): Task[] {
    const phase = this.PhaseWithTasks.find(p => p.active);
    return phase ? phase.tasks : [];
  }

  /* ==================== OVERLAY TASK ==================== */
  async toggleTaskStatus(task: Task) {
    const newStatus = task.status === 'done' ? 'TODO' : 'done';
    try {
      await lastValueFrom(this.taskService.updateTask(task.id!, {
        projectId: task.projectId,
        phaseId: task.phaseId!,
        title: task.title,
        description: task.description,
        status: newStatus,
        dueDate: task.dueDate
      }));
      await this.loadProjectDetails(this.selectedProjectIndex);
    } catch (err) {
      console.error('Errore aggiornando task:', err);
    }
  }

  async deleteTask(task: Task) {
    if (!confirm(`Eliminare il task "${task.title}"?`)) return;
    try {
      await lastValueFrom(this.taskService.deleteTask(task.id!));
      await this.loadProjectDetails(this.selectedProjectIndex);
    } catch (err) {
      console.error('Errore eliminando task:', err);
    }
  }

  /* ==================== OVERLAY AGGIUNGI MEMBRO ==================== */
  showAddMemberModal = false;
  newMemberEmail = '';
  addMemberError: string | null = null;
  selectedProjectForMember: Project | null = null;

  openAddMemberModal(project: Project) {
    if (!project.id) return;
    this.selectedProjectForMember = project;
    this.newMemberEmail = '';
    this.addMemberError = null;
    this.showAddMemberModal = true;
  }

  closeAddMemberModal(updated?: boolean) {
    this.showAddMemberModal = false;
    this.selectedProjectForMember = null;
    if (updated) this.loadProjects();
  }

  async addMember() {
    if (!this.newMemberEmail || !this.selectedProjectForMember) {
      this.addMemberError = 'Inserisci un indirizzo email valido';
      return;
    }
    try {
      await lastValueFrom(this.projectService.addMemberToProject(this.selectedProjectForMember.id!, this.newMemberEmail));
      this.closeAddMemberModal(true);
    } catch (err) {
      console.error(err);
      this.addMemberError = 'Errore aggiungendo membro';
    }
  }

}
