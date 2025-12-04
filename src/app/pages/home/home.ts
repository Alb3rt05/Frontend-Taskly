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
    EditTask
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  projectService = inject(ProjectService);
  projects: Project[] = [];
  projectPhases: ProjectPhase[] = [];
  selectedProjectIndex = 0;

  // Per le modals
  showAddProjectModal = false;
  showAddTaskModal = false;
  showEditTaskModal = false;
  selectedPhaseForTask: string | null = null;
  selectedTaskForEdit: Task | null = null;

  ngOnInit(): void {
    this.loadProjects();
  }

  async loadProjects() {
    try {
      this.projects = await this.projectService.getUserProjects();

      if (this.projects.length > 0) {
        // seleziona il primo progetto come attivo (se non hai logica di selezione)
        this.projects = this.projects.map((p, idx) => ({ ...p, active: idx === 0 }));

        // carica tasks per il progetto selezionato
        await this.loadProjectDetails(0);
      } else {
        this.projectPhases = [];
      }

    } catch (err) {
      console.error('Errore caricando progetti:', err);
    }
  }

  async loadProjectDetails(index: number) {
    const project = this.projects[index];
    if (!project) return;
    try {
      const projectId =
        project.id ??
        project._id?.$oid ??   // <--- corretto per Mongo
        project._id ??         // fallback
        null;

      const tasks = projectId
        ? await this.projectService.getTasksForProject(projectId)
        : [];
      // normalizza taskId e phaseId per comodità
      const normalizedTasks: Task[] = (tasks || []).map(t => {
        const id = (t as any)._id ? ((t as any)._id.$oid || (t as any)._id) : (t as any).id;
        return { ...t, id: id };
      });

      // attach tasks to project (so ProjectCard can use if needed)
      project.tasks = normalizedTasks;

      // create phases array for UI
      const phases: Phase[] = project.phases || [];
      // ordina per order se presente
      phases.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      // create projectPhases array for UI
      this.projectPhases = phases.map(phase => { // filtra tasks per phase
        const phaseTasks = normalizedTasks.filter(t => (t.phaseId ?? t.phaseId) === phase.id);
        const todo = phaseTasks.filter(t => !(t.status && t.status.toLowerCase().includes('done')));
        const done = phaseTasks.filter(t => (t.status && t.status.toLowerCase().includes('done')));
        return { 
          name: phase.title, 
          phaseId: phase.id, 
          tasks: todo || [], // sempre array
          tasksDone: done || []
        };
      });

    } catch (err) {
      console.error('Errore caricando dettagli progetto:', err);
      this.projectPhases = [];
    }
  }

  addProject() {
    this.openAddProjectModal();
  }

  async editProject(project: Project) {
    const newTitle = prompt('Modifica titolo progetto', project.title);
    if (!newTitle) return;
    try {
      const projectId = project.id ?? project._id?.$oid ?? project._id;
      if (!projectId) return;
      await this.projectService.updateProject({ ...project, title: newTitle });
      await this.loadProjects();
    } catch (err) {
      console.error('Errore modificando progetto:', err);
    }
  }

  async deleteProject(project: Project) {
    if (!confirm(`Eliminare il progetto "${project.title}"?`)) return;
    try {
      const projectId = project.id ?? project._id?.$oid ?? project._id;
      if (!projectId) return;
      await this.projectService.deleteProject(projectId);
      await this.loadProjects();
    } catch (err) {
      console.error('Errore eliminando progetto:', err);
    }
  }

  // gestore click su project item: carica dettagli del progetto selezionato
  async selectProject(i: number) {
    this.projects = this.projects.map((p, idx) => ({ ...p, active: idx === i }));
    this.selectedProjectIndex = i;
    await this.loadProjectDetails(i);
  }

  /*----------------------------
  Per le Modals
  ------------------------------ */
  // ---------- PROGETTO ----------
  openAddProjectModal() {
    this.showAddProjectModal = true;
  }

  closeAddProjectModal(created?: boolean) {
    this.showAddProjectModal = false;
    if (created) this.loadProjects();
  }

  // ---------- TASK ----------
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

}
