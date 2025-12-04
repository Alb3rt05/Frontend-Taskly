import { Component } from '@angular/core';
import { Sidebar } from "../../components/sidebar/sidebar";
import { HeroCard } from '../../components/hero-card/hero-card';

@Component({
  selector: 'app-profile',
  imports: [Sidebar, HeroCard],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  TODO() {
    
  }
}
