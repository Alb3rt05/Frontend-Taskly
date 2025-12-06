// Angular
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Services
import { ProjectService } from '../../services/project.service';
// Components
import { Sidebar } from '../../components/home/sidebar/sidebar';
import { HeroCard } from '../../components/home/hero-card/hero-card';
import { ProjectCard } from '../../components/home/projects-project/projects-project';
// Interfaces
import { Project } from '../../models/project';
import { Task } from '../../models/task';
import { ProjectPhase } from '../../models/projectPhase';
import { Phase } from '../../models/phase';
// Modals
import { lastValueFrom } from 'rxjs';
import { TaskService } from '../../services/task.service';
import { PhaseCard } from "../../components/home/project-phase/project-phase";

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

  projectService = inject(ProjectService); // <- Iniettiamo il servizio
  projects: Project[] = [];                // <- Array di progetti
  projectPhases: ProjectPhase[] = [];      // <- Array di fasi
  selectedProjectIndex = 0;                // <- Indice progetto selezionato
  selectedPhaseIndex = 0;                  // <- Indice fase selezionata
  selectedTaskIndex = 0;                   // <- Indice task selezionato

  // Overlay "creazione progetto"
  showAddProjectModal = false;              // <- Mostra overlay
  newProjectTitle = '';                     // <- Titolo nuovo progetto
  loadingCreateProject = false;             // <- Loading creazione progetto
  createProjectError: string | null = null; // <- Errore creazione progetto     
  // Apri/Chiudi overlay
  openAddProjectModal() {
    this.showAddProjectModal = true;
    this.newProjectTitle = '';
    this.createProjectError = null;
  }
  // Chiudi overlay se creato
  closeAddProjectModal(creted?: boolean) {
    this.showAddProjectModal = false;
    if (creted) this.loadProjects();
  }
  // Crea progetto
  async createProject() {
    if (!this.newProjectTitle) {
      this.createProjectError = 'Il titolo è obbligatorio';
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

  // Inizializzazione
  ngOnInit(): void {
    this.loadProjects();
  }
  // Carica progetti
  async loadProjects() {
    try {
      const rawProjects = await this.projectService.getUserProjects();
      this.projects = rawProjects.map((p, idx) => {
        return {
          ...p,
          members: p.members || [],
          active: idx === 0,
        }
      });
      if (this.projects.length > 0) await this.loadProjectDetails(0);
    } catch (err) {
      console.error('Errore caricando progetti:', err);
    }
  }
  // Carica dettagli progetto
  async loadProjectDetails(index: number) {
    const project = this.projects[index];
    if (!project) return;
    try {
      const phases: Phase[] = project.phases || [];
      phases.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)); // Ordina fasi in modo ascendente
      let tasks: Task[] = [];
      try {
        tasks = await lastValueFrom(this.taskService.getTasksByProject(project.id!));
      } catch (e) {
        console.warn("Tasks non disponibili, fasi in caricamento...");
      }
      this.projectPhases = phases.map((p, idx) => ({          // <- Mappa fasi aggiungendo i task e i task completati
        name: p.title,
        active: idx === 0,                                    // <- Fase attiva
        order: p.order ?? 0,
        phaseId: p.id,
        tasks: tasks.filter(t => t.phaseId === p.id),
        tasksDone: tasks.filter(t => t.phaseId === p.id && t.status === 'done'),
      }));
    } catch (err) {
      console.error('Errore caricando dettagli progetto:', err);
      this.projectPhases = [];
    }
  }
  /* --------------------------- OVERLAY Progetto ----------------------------------- */
  // Seleziona progetto e carica dettagli 
  selectProject(i: number) {
    this.projects = this.projects.map((p, idx) => ({ ...p, active: idx === i }));
    this.selectedProjectIndex = i;
    this.loadProjectDetails(i);
  }
  // Overlay aggiungi membro
  showAddMemberModal = false;
  newMemberEmail = '';
  addMemberError: string | null = null;
  selectedProjectForMember: Project | null = null;
  // Apri overlay aggiungi membro
  openAddMemberModal(project: Project) {
    if (!project.id) {
      console.error('Progetto non valido:', project);
      return;
    }
    this.selectedProjectForMember = project;
    this.newMemberEmail = '';
    this.addMemberError = null;
    this.showAddMemberModal = true;
  }
  // Chiudi overlay aggiungi membro
  closeAddMemberModal(updated?: boolean) {
    this.showAddMemberModal = false;
    this.selectedProjectForMember = null;
    if (updated) this.loadProjects();
  }
  // Aggiungi membro
  async addMember() {
    if (!this.newMemberEmail || !this.selectedProjectForMember) {
      this.addMemberError = 'Inserisci un indirizzo email valido';
      return;
    }
    try {
      await this.projectService.addMemberToProject(this.selectedProjectForMember.id!, this.newMemberEmail);
      this.closeAddMemberModal(true);
      this.loadProjects();
    } catch (err) {
      console.error(err);
      this.addMemberError = 'Errore aggiungendo membro';
    }
  }
  // Overlay elimina progetto
  showDeleteProjectModal = false;
  selectedProjectForDelete: Project | null = null;
  // Apri overlay elimina progetto
  openDeleteProjectModal(project: Project) {
    if (!project.id) {
      console.error('Progetto non valido:', project);
      return;
    }
    this.selectedProjectForDelete = project;
    this.showDeleteProjectModal = true;
  }
  // Chiudi overlay elimina progetto
  closeDeleteProjectModal(deleted?: boolean) {
    this.showDeleteProjectModal = false;
    this.selectedProjectForDelete = null;
    if (deleted) this.loadProjects();
  }
  // Elimina progetto
  async deleteProject() {
    if (!this.selectedProjectForDelete) return;
    try {
      await this.projectService.deleteProject(this.selectedProjectForDelete.id!);
      this.closeDeleteProjectModal(true);
    } catch (err) {
      console.error('Errore eliminando progetto:', err);
    }
  }
  /* --------------------------- OVERLAY Fase ----------------------------------- */
  // Seleziona fase e carica dettagli ///poi da togliere se l'altro è finito
  selectPhase(i: number) {
    this.projectPhases = this.projectPhases.map((p, idx) => ({ ...p, active: idx === i }));
  }



/* --------------------------- OVERLAY Task ----------------------------------- */
  // Overlay aggiorna task
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
  // Overlay elimina task
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
