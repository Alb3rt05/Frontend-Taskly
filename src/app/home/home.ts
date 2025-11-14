import { Component } from '@angular/core';
import { Sidebar } from "../sidebar/sidebar";
import { HeroCard } from "../hero-card/hero-card";
import { ProjectSidebar } from "../project-sidebar/project-sidebar";
import { ProjectContent } from "../project-content/project-content";
import { ProjectCard } from "../project-card/project-card";

@Component({
  selector: 'app-home',
  imports: [Sidebar, HeroCard, ProjectSidebar, ProjectContent, ProjectCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
