import { Component } from '@angular/core';
import { Sidebar } from "../sidebar/sidebar";
import { HeroCard } from "../hero-card/hero-card";

@Component({
  selector: 'app-home',
  imports: [Sidebar, HeroCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
