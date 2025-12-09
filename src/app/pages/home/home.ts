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
import { PhaseRequest } from '../../models/phaserequest';
// Helpers
import { lastValueFrom } from 'rxjs';
import { TaskCard } from "../../components/home/project-task/project-task";

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
    PhaseCard,
    TaskCard
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  /* ==================== SERVICES ==================== */
  projectService = inject(ProjectService);
  taskService = inject(TaskService);

  /* ==================== VARIABILI ==================== */
  projects: Project[] = [];
  projectPhases: PhaseWithTasks[] = [];
  selectedProjectIndex = 0;
  selectedPhaseIndex = 0;
  selectedTaskIndex = 0;

  /* ==================== MODALI ==================== */
  // Progetto
  showAddProjectModal = false;
  newProjectTitle = '';
  loadingCreateProject = false;
  createProjectError: string | null = null;
  showDeleteProjectModal = false;
  selectedProjectForDelete: Project | null = null;
  showAddMemberModal = false;
  newMemberEmail = '';
  addMemberError: string | null = null;
  selectedProjectForMember: Project | null = null;

  // Fase
  showAddPhaseModal = false;
  newPhaseTitle = '';
  loadingCreatePhase = false;
  createPhaseError: string | null = null;
  showDeletePhaseModal = false;
  phaseToDelete?: PhaseWithTasks;

  // Task
  showAddTaskModal = false;
  newTaskTitle = '';
  loadingCreateTask = false;
  createTaskError: string | null = null;
  showDeleteTaskModal = false;
  taskToDelete: Task | null = null;

  ngOnInit(): void {
    this.loadProjects();
  }

  /* ==================== CARICAMENTO PROGETTI ==================== */
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

    // START: MODIFICA PER GESTIRE ENDPOINT TASK MANCANTE
    let tasks: Task[] = [];
    try {
      // Questa chiamata tornerà un Observable vuoto grazie alla modifica in TaskService (punto 3)
      // Se l'endpoint backend fosse attivo, le task verrebbero caricate qui.
      tasks = await lastValueFrom(this.taskService.getTasksByProject(project.id!));
    } catch (e) {
      // In questo scenario (endpoint mancante), l'errore è previsto
      console.warn("Tasks non disponibili (l'endpoint backend è mancante). Le fasi verranno caricate senza task.");
    }
    // END: MODIFICA PER GESTIRE ENDPOINT TASK MANCANTE

    try {
      const phases: Phase[] = project.phases || [];
      phases.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      this.projectPhases = phases.map((p, idx) => ({
        ...p,
        active: idx === 0,
        // La logica di filtraggio è corretta e applica le task caricate (che per ora saranno [])
        tasks: tasks.filter(t => t.phaseId === p.id),
        tasksDone: tasks.filter(t => t.phaseId === p.id && t.status === 'done')
      }));
    } catch (err) {
      console.error('Errore caricando dettagli progetto:', err);
      this.projectPhases = [];
    }
  }

  /* ==================== PROGETTI ==================== */
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

  selectProject(i: number) {
    this.projects = this.projects.map((p, idx) => ({ ...p, active: idx === i }));
    this.selectedProjectIndex = i;
    this.loadProjectDetails(i);
  }

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

    // START: MODIFICA PER ENDPOINT MANCANTE
    this.addMemberError = 'Funzionalità non disponibile. L\'API del backend non supporta ancora l\'aggiunta di membri.';
    console.warn("Chiamata addMemberToProject bloccata: L'endpoint POST /projects/{id}/members è mancante nel backend.");

    // Codice originale (commentato per prevenire errore 404):
    /*
    try {
      await lastValueFrom(this.projectService.addMemberToProject(this.selectedProjectForMember.id!, this.newMemberEmail));
      this.closeAddMemberModal(true);
    } catch (err) {
      console.error(err);
      this.addMemberError = 'Errore aggiungendo membro';
    }
    */
    // END: MODIFICA PER ENDPOINT MANCANTE
  }

  /* ==================== FASI ==================== */
  selectPhase(i: number) {
    this.projectPhases = this.projectPhases.map((p, idx) => ({ ...p, active: idx === i }));
    this.selectedPhaseIndex = i;
  }

  openDeletePhaseModal(phase: PhaseWithTasks) {
    this.phaseToDelete = phase;
    this.showDeletePhaseModal = true;
  }

  closeDeletePhaseModal(deleted?: boolean) {
    this.showDeletePhaseModal = false;
    this.phaseToDelete = undefined;
    if (deleted) this.loadProjectDetails(this.selectedProjectIndex);
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
    this.loadProjects();
  }

  openAddPhaseModal() {
    this.showAddPhaseModal = true;
    this.newPhaseTitle = '';
    this.createPhaseError = null;
  }

  closeAddPhaseModal(created?: boolean) {
    this.showAddPhaseModal = false;
    if (created) this.loadProjectDetails(this.selectedProjectIndex);
  }

  async createPhase() {
    if (!this.newPhaseTitle) {
      this.createPhaseError = 'Il titolo è obbligatorio';
      return;
    }
    this.loadingCreatePhase = true;
    this.createPhaseError = null;
    try {
      const selectedProject = this.projects[this.selectedProjectIndex];
      if (!selectedProject || !selectedProject.id) {
        throw new Error("Progetto non selezionato o ID mancante.");
      }
      const projectId = selectedProject.id;
      // Calcola il nuovo ordine (quante fasi ci sono + 1)
      const newPhaseOrder = this.projectPhases.length;
      // Questo "inganna" il framework di backend per non fallire la deserializzazione.
      const phasePayload = {
        // Genera un ID fittizio (l'ObjectId Java lo ignorerà/sovrascriverà)
        id: Date.now().toString(),
        title: this.newPhaseTitle,
        order: newPhaseOrder, // Necessario se il backend tenta di leggerlo
        tasks: [] // Invia una lista vuota per evitare NullPointer in Java
      };
      // Chiama il servizio con il payload completo
      await lastValueFrom(this.projectService.createPhase(projectId, phasePayload));
      this.closeAddPhaseModal(true);
      this.loadProjects();
    } catch (err) {
      console.error('Errore durante la creazione della fase:', err);
      this.createPhaseError = 'Seleziona un progetto prima di creare una fase';
    } finally {
      this.loadingCreatePhase = false;
    }
  }

  /* ==================== TASK ==================== */
  get tasksOfSelectedPhase(): Task[] {
    const phase = this.projectPhases.find(p => p.active);
    return phase ? phase.tasks : [];
  }

  openAddTaskModal() {
    this.showAddTaskModal = true;
    this.newTaskTitle = '';
    this.createTaskError = null;
  }

  closeAddTaskModal(created?: boolean) {
    this.showAddTaskModal = false;
    if (created) this.loadProjectDetails(this.selectedProjectIndex);
  }

  async createTask() {
    if (!this.newTaskTitle) {
      this.createTaskError = 'Il titolo è obbligatorio';
      return;
    }
    this.loadingCreateTask = true;
    this.createTaskError = null;
    try {
      const phase = this.projectPhases.find(p => p.active);
      if (!phase) throw new Error("Seleziona una fase prima di creare un task");
      await lastValueFrom(this.taskService.createTask({
        projectId: this.projects[this.selectedProjectIndex].id!,
        phaseId: phase.id!,
        title: this.newTaskTitle
      }));
      this.closeAddTaskModal(true);
    } catch (err) {
      console.error(err);
      this.createTaskError = 'Errore creando task';
    } finally {
      this.loadingCreateTask = false;
    }
  }

  openDeleteTaskModal(task: Task) {
    this.taskToDelete = task;
    this.showDeleteTaskModal = true;
  }

  async deleteTask() {
    if (!this.taskToDelete) return;
    try {
      await lastValueFrom(this.taskService.deleteTask(this.taskToDelete.id!));
      this.showDeleteTaskModal = false;
      this.taskToDelete = null;
      await this.loadProjectDetails(this.selectedProjectIndex);
    } catch (err) {
      console.error('Errore eliminando task:', err);
    }
  }
}