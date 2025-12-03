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

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    Sidebar,
    HeroCard,
    ProjectCard,
    ProjectContent,
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  projectService = inject(ProjectService);
  projects: Project[] = [];
  projectPhases: ProjectPhase[] = [];
  selectedProjectIndex = 0;

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

      this.projectPhases = phases.map(phase => {
        const phaseTasks = normalizedTasks.filter(t => (t.phaseId ?? t.phaseId) === phase.id);
        const todo = phaseTasks.filter(t => !(t.status && t.status.toLowerCase().includes('done')));
        const done = phaseTasks.filter(t => (t.status && t.status.toLowerCase().includes('done')));
        return { name: phase.title, phaseId: phase.id, tasks: todo };
      });

    } catch (err) {
      console.error('Errore caricando dettagli progetto:', err);
      this.projectPhases = [];
    }
  }

  async addProject() {
    const title = prompt('Titolo progetto');
    if (!title) return;
    try {
      await this.projectService.createProject(title);
      await this.loadProjects();
    } catch (err) {
      console.error('Errore creando progetto:', err);
    }
  }

  editProject(project: Project) {
    console.log('Edit project', project);
  }

  deleteProject(project: Project) {
    console.log('Delete project', project);
  }

  // gestore click su project item: carica dettagli del progetto selezionato
  async selectProject(i: number) {
    this.projects = this.projects.map((p, idx) => ({ ...p, active: idx === i }));
    this.selectedProjectIndex = i;
    await this.loadProjectDetails(i);
  }
}
