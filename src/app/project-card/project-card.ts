import { Component } from '@angular/core';
import { ProjectSidebar } from "../project-sidebar/project-sidebar";
import { ProjectContent } from "../project-content/project-content";

@Component({
  selector: 'app-project-card',
  imports: [ProjectSidebar, ProjectContent],
  templateUrl: './project-card.html',
  styleUrl: './project-card.css',
})
export class ProjectCard {

}
