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
import { ProjectPhase } from '../../models/ProjectPhase';

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

  ngOnInit(): void {
    this.loadProjects();
  }

  async loadProjects() {
    try {
      this.projects = await this.projectService.getUserProjects();

      if (this.projects.length > 0) {
        this.projectPhases = [
          { name: 'Da fare', tasks: this.projects[0].tasks.filter((t: Task) => !t.done) },
          { name: 'Fatte', tasks: this.projects[0].tasks.filter((t: Task) => t.done) },
        ];
      } else {
        this.projectPhases = [];
      }

    } catch (err) {
      console.error('Errore caricando progetti:', err);
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
}
