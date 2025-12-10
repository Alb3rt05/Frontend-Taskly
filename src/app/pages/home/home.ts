// Angular
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Services
import { ProjectService } from '../../services/project.service';
// Per la gestione dei Task, se TaskRequest non è importato da TaskService, dovresti aggiungerlo qui se necessario
import { TaskService, TaskRequest } from '../../services/task.service';
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
  newTaskDescription = ''; // 👈 Necessario per la Modifica e Creazione completa
  loadingCreateTask = false;
  createTaskError: string | null = null;

  showDeleteTaskModal = false;
  taskToDelete: Task | null = null;

  showEditTaskModal = false;
  taskToEdit: Task | null = null;
  editTaskTitle: string = '';
  editTaskDescription: string = '';
  updateTaskError: string | null = null;

  ngOnInit(): void {
    this.loadProjects();
  }

  /* ==================== CARICAMENTO PROGETTI ==================== */
  async loadProjects() {
    try {
      const rawProjects = await this.projectService.getUserProjects();
      const savedProjectId = localStorage.getItem('selectedProjectId');
      // Trova l'indice del progetto salvato
      let indexToLoad = 0;
      if (savedProjectId) {
        const foundIndex = rawProjects.findIndex(p => p.id === savedProjectId);
        if (foundIndex >= 0) indexToLoad = foundIndex;
      }
      // Costruisci l'array con `active` corretto
      this.projects = rawProjects.map((p, idx) => ({
        ...p,
        members: p.members || [],
        active: idx === indexToLoad
      }));
      // Aggiorna l'indice selezionato
      this.selectedProjectIndex = indexToLoad;
      // Carica dettagli progetto selezionato
      await this.loadProjectDetails(indexToLoad);
      // Rimuovi dal localStorage
      localStorage.removeItem('selectedProjectId');
    } catch (err) {
      console.error('Errore caricando progetti:', err);
    }
  }


  async loadProjectDetails(index: number) {
    const project = this.projects[index];
    if (!project) return;

    let tasks: Task[] = [];
    try {
      // CARICAMENTO TASK DAL BACKEND
      const rawTasks = await lastValueFrom(this.taskService.getTasksByProject(project.id!));
      tasks = rawTasks as unknown as Task[];
    } catch (e) {
      console.warn("Tasks non disponibili. Le fasi verranno caricate senza task.", e);
    }

    try {
      const phases: Phase[] = project.phases || [];
      phases.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      // Mantieni la fase precedentemente selezionata attiva se possibile
      const currentSelectedPhaseId = this.projectPhases[this.selectedPhaseIndex]?.id;

      this.projectPhases = phases.map((p, idx) => ({
        ...p,
        active: currentSelectedPhaseId ? p.id === currentSelectedPhaseId : idx === 0,
        tasks: tasks.filter(t => t.phaseId === p.id),
        tasksDone: tasks.filter(t => t.phaseId === p.id && t.status && t.status.toUpperCase() === 'DONE')
      }));

      // Aggiorna l'indice della fase selezionata o imposta 0
      this.selectedPhaseIndex = this.projectPhases.findIndex(p => p.active) || 0;

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
    this.selectedPhaseIndex = 0; // Reset della fase
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
    // Simulazione logica bloccata per l'endpoint mancante
    this.addMemberError = 'Funzionalità non disponibile (endpoint mancante)';
    console.warn("Chiamata addMemberToProject bloccata: L'endpoint POST /projects/{id}/members è mancante nel backend.");
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
    const project = this.projects[this.selectedProjectIndex];
    try {
      await lastValueFrom(this.projectService.deletePhase(project.id!, this.phaseToDelete.id));
      // Aggiorna stato locale senza ricaricare
      this.projectPhases = this.projectPhases.filter(p => p.id !== this.phaseToDelete!.id);
      project.phases = project.phases?.filter(p => p.id !== this.phaseToDelete!.id);
      this.selectedPhaseIndex = this.projectPhases.length > 0 ? 0 : -1;
      this.closeDeletePhaseModal(false); // deleted=false perché aggiorniamo localmente
    } catch (err) {
      console.error('Errore eliminando fase:', err);
    }
  }

  openAddPhaseModal() {
    this.showAddPhaseModal = true;
    this.newPhaseTitle = '';
    this.createPhaseError = null;
  }

  closeAddPhaseModal(created?: boolean) {
    this.showAddPhaseModal = false;
    if (created) {
      this.loadProjectDetails(this.selectedProjectIndex);
    }
  }

  async createPhase() {
    if (!this.newPhaseTitle) return;
    this.loadingCreatePhase = true;
    this.createPhaseError = null;
    try {
      const selectedProject = this.projects[this.selectedProjectIndex];
      if (!selectedProject?.id) throw new Error("Progetto non selezionato.");
      const phasePayload = {
        id: Date.now().toString(),
        title: this.newPhaseTitle,
        order: (selectedProject.phases?.length || 0),
        tasks: []
      };
      await lastValueFrom(this.projectService.createPhase(selectedProject.id, phasePayload));
      // Salva progetto selezionato
      localStorage.setItem('selectedProjectId', selectedProject.id);
      // Ricarica pagina
      window.location.reload();
    } catch (err) {
      console.error(err);
      this.createPhaseError = "Errore creando fase";
    } finally {
      this.loadingCreatePhase = false;
    }
  }

  /* ==================== TASK CRUD ==================== */
  get tasksOfSelectedPhase(): Task[] {
    const phase = this.projectPhases.find(p => p.active);
    return phase ? phase.tasks : [];
  }

  // ----------------- Creazione -----------------
  openAddTaskModal() {
    this.showAddTaskModal = true;
    this.newTaskTitle = '';
    this.newTaskDescription = ''; // Reset della descrizione
    this.createTaskError = null;
  }

  closeAddTaskModal(created?: boolean) {
    this.showAddTaskModal = false;
    if (created) this.loadProjectDetails(this.selectedProjectIndex);
  }

  // in home.ts

  async createTask() {
    if (!this.newTaskTitle) {
      this.createTaskError = 'Il titolo è obbligatorio';
      return;
    }
    this.loadingCreateTask = true;
    this.createTaskError = null;
    try {
      const project = this.projects[this.selectedProjectIndex];
      const phase = this.projectPhases.find(p => p.active);
      // 2. CONTROLLO CRITICO: Verifichiamo la presenza di Project e Phase e dei loro ID
      if (!project || !project.id) {
        throw new Error("Impossibile trovare l'ID del Progetto Selezionato.");
      }
      if (!phase || !phase.id) {
        // Questo è il punto più probabile di fallimento
        throw new Error("Seleziona una Fase per creare il Task (Fase ID mancante).");
      }
      // Logging per debug finale (opzionale, ma utile)
      console.log('Payload Task in invio:', {
        projectId: project.id,
        phaseId: phase.id,
        title: this.newTaskTitle,
        description: this.newTaskDescription || '',
        status: 'TODO',
        dueDate: null
      });
      // Creazione del payload
      const payload: TaskRequest = {
        projectId: project.id,
        phaseId: phase.id,
        title: this.newTaskTitle,
        description: this.newTaskDescription || '',
        status: 'TODO',
        dueDate: null // O 'undefined' se non hai aggiornato l'interfaccia
      };
      await lastValueFrom(this.taskService.createTask(payload));
      this.closeAddTaskModal(true);
    } catch (err: any) {
      console.error(err);
      // Messaggio di errore più specifico per l'utente
      this.createTaskError = err.message || 'Errore di connessione o dati mancanti. Verifica che Progetto e Fase siano selezionati.';
    } finally {
      this.loadingCreateTask = false;
    }
  }

  // ----------------- Eliminazione -----------------
  openDeleteTaskModal(task: Task) {
    this.taskToDelete = task;
    this.showDeleteTaskModal = true;
  }

  // 👈 DEFINIZIONE MANCANTE
  closeDeleteTaskModal(deleted?: boolean) {
    this.showDeleteTaskModal = false;
    this.taskToDelete = null;
    if (deleted) this.loadProjectDetails(this.selectedProjectIndex);
  }

  async deleteTask() {
    if (!this.taskToDelete) return;
    try {
      await lastValueFrom(this.taskService.deleteTask(this.taskToDelete.id!));
      this.closeDeleteTaskModal(true);
    } catch (err) {
      console.error('Errore eliminando task:', err);
      // Gestione errori
    }
  }

  // ----------------- Modifica (Aggiunto) -----------------
  openEditTaskModal(task: Task) {
    this.taskToEdit = task;
    this.editTaskTitle = task.title;
    this.editTaskDescription = task.description || '';
    this.updateTaskError = null;
    this.showEditTaskModal = true;
  }

  closeEditTaskModal(updated?: boolean) {
    this.showEditTaskModal = false;
    this.taskToEdit = null;
    if (updated) this.loadProjectDetails(this.selectedProjectIndex);
  }

  async updateTask() {
    if (!this.taskToEdit || !this.editTaskTitle) {
      this.updateTaskError = "Il titolo non può essere vuoto.";
      return;
    }

    const updatePayload: TaskRequest = {
      // Il backend deve poter accettare l'aggiornamento parziale (PATCH/PUT DTO)
      projectId: this.taskToEdit.projectId,
      phaseId: this.taskToEdit.phaseId,
      title: this.editTaskTitle,
      description: this.editTaskDescription,
      status: this.taskToEdit.status ?? "TODO", // Manteniamo lo status esistente
    };

    try {
      await lastValueFrom(this.taskService.updateTask(this.taskToEdit.id!, updatePayload));
      this.closeEditTaskModal(true);
    } catch (err) {
      console.error('Errore aggiornando task:', err);
      this.updateTaskError = `Errore di aggiornamento: ${err}`;
    }
  }
}